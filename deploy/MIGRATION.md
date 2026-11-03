# OIDC deployment migration

This change replaces the Auth0 credential broker and SSM-to-shell deployment path with the reviewed [shared suite PR #40](https://github.com/topcoder-platform/tc-deploy-scripts/pull/40), pinned to `b900d58e38787e3397743412597c6563fe6e08dd`. Build and deployment run in separate jobs. The deployer cannot read Parameter Store, Secrets Manager or decrypt KMS data, including through another assumed role. ECS continues resolving the existing runtime secret references using the execution role.

## Production target

The read-only inventory on 2026-11-03 verified account `409275337247`, cluster `community-app-serverless`, service `community-app-svc`, family `community-app-task`, and container `community-app`. `prod.json` preserves the observed task/execution roles and names the proposed service-specific deployment role. `prod-baseline.json` records references only; it contains no parameter values. Do not recreate the service or replace its complete task definition from this baseline.

## Infrastructure prerequisites, applied separately by an administrator

1. In each account, register the CircleCI OIDC issuer `https://oidc.circleci.com/org/947bef5e-1669-415d-b83c-4fc85155b7df` with client ID `947bef5e-1669-415d-b83c-4fc85155b7df`. The current production account has only the legacy Auth0 provider. Do not remove that provider until all its consumers have migrated.
2. Review and install `iam/prod-role.cloudformation.json` with an administrator/IaC identity. It creates the proposed deployment role and applies the same least-privilege policy as a permissions boundary. The trust binds this CircleCI project, repository, checkout branch and configuration branch. It does not grant infrastructure creation to CircleCI.
3. Configure ECR repository `community-app` with unconditional `IMMUTABLE` tags and supported scan-on-push. Existing tags are not retagged. The release fails for MEDIUM/HIGH/CRITICAL/UNDEFINED findings, failed scans, or a mismatched digest.
4. In the infrastructure that owns the task definition, add the reviewed container check from `prod-healthcheck.json`, keeping all roles, runtime secret references, resources, mounts and sidecars. Verify the health endpoint against the running container in dev first. Preserve circuit-breaker rollback and positive desired capacity. Remove any `RESET_DB` secret binding and plaintext secret environment entries before adoption. Keep the execution role's runtime read permissions scoped to the references that service needs.
5. Create restricted `community-app-dev-deploy` and `community-app-prod-deploy` CircleCI contexts without Auth0/static AWS credentials. Restrict production to the reviewed `master` checkout and configuration ref, authorized operators, and approval job. Remove legacy credentials from project settings too: removing `org-global` alone does not remove project-level variables. Confirm `CIRCLE_OIDC_TOKEN_V3` is issued. Disable secret access for forks and SSH debugging in deployment jobs.

## Development acceptance before merge/release

The saved dev AWS session had expired during preparation. No dev cluster, role or family has been guessed. **This PR is a draft until an administrator verifies and commits `deploy/dev.json` for account `811668436784` and branch `develop`, with corresponding narrow IAM policy/trust.** Use the same schema as `prod.json`, but inspect the actual dev resources and roles; do not replace just the account number. The dev job fails closed while its manifest is absent. Branches other than `develop` and `master` build only and receive no deployment context.

Run the shared offline suite, validate the CircleCI config and IAM policies, and test a dev release plus an unhealthy-image rollback. Verify CloudTrail contains no SSM/Secrets Manager calls from the deployment principal. Remove its old broker grants only after migration. Check the runtime secret references and roles stayed unchanged. Production requires the manual approval job and a passing digest/scan/health verification.

The pinned executor is `cimg/aws@sha256:4cf3768db00ddf9bc439b8c84e8a60c11a14edf81c8baf76f74132144f8340d5`. Python/AWS CLI/Buildx/Git compatibility was tested with the shared offline suite. No package installation or service build runs in the deployment job. The Dockerfile retains the existing in-image quality gates. This PR does not deploy, change IAM, rotate credentials, or claim a successful live rollout.

## Community App prerequisites and public build configuration

This PR targets `develop`, including merged security PR #7296. Promote that prerequisite plus this change to `master` together; old master still embeds credentials in build arguments. The image now selects a committed development/production target for public endpoint configuration, serves bundles through the supported same-origin CDN fallback, and runs the existing security and application tests. Public npm settings moved from `.npmrc` into Docker ENV so the shared clean-source builder can reject credential files uniformly.

An administrator must add every required server-side secret reference formerly loaded from `buildvar` to the ECS task before adoption. The current production task has only the recorded references in `prod-baseline.json`; it does not yet contain all those runtime bindings. Reuse the existing parameter ARNs with appvar precedence where names overlap; do not fetch their values in CI. Verify login, M2M calls, Contentful, mail and Google integrations in dev.

Optional performance testing remains approval-gated and independent of deployment. The old smoke workflow referenced an undefined `Smoke-Testing-On-Production` job and recursively triggered the CircleCI API with a shared token; this broken trigger is removed. Application/security tests remain build gates. Restore any required production browser smoke job explicitly with a test-only context before enabling it; the deployment context must not contain QA credentials.

For manual browser-smoke dependency installation, use `npm ci --legacy-peer-deps --install-links` in `automated-smoke-test`; its duplicate public npm configuration file was removed from the Docker source archive.
