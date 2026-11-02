"""Adapt the pinned tc-deploy-scripts v1.4.17 secret merge to overlapping paths.

The deploy command loads buildvar first and appvar second. Keep appvar's value
when both contain a name (for example NODE_CONFIG_ENV), without reading secrets.
Fail closed if the pinned deployment script changes its expected implementation.
"""
from pathlib import Path
import sys


ORIGINAL = ".containerDefinitions[0].secrets[$psenvcount |tonumber] |= .+ { name: $name, valueFrom: $value  }"
REPLACEMENT = ".containerDefinitions[0].secrets = ((.containerDefinitions[0].secrets // []) | map(select(.name != $name)) + [{name: $name, valueFrom: $value}])"


def prepare(source):
    if source.count(ORIGINAL) != 1:
        raise ValueError("Unexpected tc-deploy-scripts secret merge; review before deploying")
    return source.replace(ORIGINAL, REPLACEMENT)


if __name__ == "__main__":
    target = Path(sys.argv[1])
    target.write_text(prepare(target.read_text()))
