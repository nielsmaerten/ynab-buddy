# YNAB Buddy
A parser, uploader and CLI companion for YNABers.  

## How to use it
1. Have [Node](https://nodejs.org) installed
2. Open up a new terminal or command prompt
4. Run: `npx ynab-buddy`

## CLI Options
### Usage:
```sh
npx ynab-buddy [--upload] [--force] [--verbose] [directory]
```

`directory`  
Where ynab-buddy should look for files to parse.  
If you don't set one, the current working directory is used.

`--upload` or `-u`  
Upload transactions directly to YNAB's API after parsing

`--force` or `-f`  
Do not ask for confirmation when uploading files

`--verbose` or `-v`  
Print extra detailed logs and errors

## Configuration
After the first run, ynab-buddy creates a file called
`ynab-buddy.conf.yaml` in your home directory.  
Edit this file to:
* add your YNAB Personal Access Token (required for uploading)
* link file names of your bank's statements to YNAB budgets and accounts
* modify how your files are parsed by providing a Custom Config

## About ynab-buddy
This project is still a work in progress, 
but here's what you need to know:

* YNAB Buddy uses [bank2ynab](https://github.com/bank2ynab), so it supports a whopping **70+ different formats**!
* The project consists of 2 packages:
  * `ynab-buddy-core` is a library use can use in your own projects. It supports things like parsing, detecting the file's format, and uploading to YNAB
  * `ynab-buddy` is a CLI tool you can use easily convert and upload your bank statements