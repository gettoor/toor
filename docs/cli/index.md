# Command line interface

Toor comes with a command line interface. Install the package `@gettoor/cli` to use it.

```sh
npm install @gettoor/cli
```

Try `--help` for full list of available options.

```sh
npx toor --help
```

CLI must be run with a configuration file which can be a YAML (`*.yaml`, `*.yml`) or JSON (`*.json`) file.

```sh
# Runs an LLM experiment based on the configuration file toor.yaml
npx tool --type experiment toor.yaml

# Process type `experiment` is taken from the configuration file name.
# The option --type can be skipped.
npx toor toor.experiment.yaml
```

CLI currently supports only one process type [LLM experiments](/cli/llm-experiments.md).