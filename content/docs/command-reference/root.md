# root

Return the relative path to the root of the <abbr>DVC project</abbr>.

## Synopsis

```usage
usage: dvc root [-h] [-q | -v]
```

## Description

While in sub-directories of the project, sometimes developers may want to refer
some file belonging to another directory. This command returns the path to the
root directory of the current <abbr>DVC project</abbr>, relative to the current
working directory. This command can be used to build a path to a dependency
file, command, or output.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Basic output

```dvc
$ dvc root

.

$ cd subdir
$ dvc root

..
```

## Example: Referencing files

```dvc
$ dvc root

../../../

$ dvc run -d $(dvc root)/data/file.cvs ... \
    python $(dvc root)/scripts/something.py
```
