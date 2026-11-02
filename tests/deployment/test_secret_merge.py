import importlib.util
import json
from pathlib import Path
import subprocess
import unittest


spec = importlib.util.spec_from_file_location(
    "prepare_deploy", Path(__file__).resolve().parents[2] / "scripts/prepare-deploy-script.py"
)
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)


class RuntimeSecrets(unittest.TestCase):
    def test_later_path_overrides_duplicates_without_losing_existing_names(self):
        template = {"containerDefinitions": [{"secrets": [
            {"name": "AUTH_SECRET", "valueFrom": "arn:fixture:buildvar/AUTH_SECRET"},
            {"name": "NODE_CONFIG_ENV", "valueFrom": "arn:fixture:buildvar/NODE_CONFIG_ENV"},
        ]}]}
        query = adapter.prepare(adapter.ORIGINAL)
        result = subprocess.run(
            ["jq", "--arg", "name", "NODE_CONFIG_ENV", "--arg", "value",
             "arn:fixture:appvar/NODE_CONFIG_ENV", query],
            input=json.dumps(template), capture_output=True, text=True, check=True,
        )
        secrets = json.loads(result.stdout)["containerDefinitions"][0]["secrets"]
        self.assertEqual(len(secrets), 2)
        self.assertEqual(secrets[0], template["containerDefinitions"][0]["secrets"][0])
        self.assertEqual(secrets[1]["valueFrom"], "arn:fixture:appvar/NODE_CONFIG_ENV")

    def test_rejects_unexpected_deployment_script(self):
        with self.assertRaises(ValueError):
            adapter.prepare("unrecognized deployment script")


if __name__ == "__main__":
    unittest.main()
