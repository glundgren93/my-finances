# Commands

## Install dependencies
```bash
npm run build
```

## Run rethinkdb
```bash
cd C:\rethinkdb-2.3.6
rethinkdb.exe -d C:\rethinkData
```

## Rethinkdb Dump
- Download python (https://www.python.org/)
- download rethinkdb-python driver with pip install rethinkdb
- Make sure rethinkdb is running
- open directory containing rethinkdb
- Execute rethinkdb dump



## Access rethinkdb
localhost:8080


### Get all data from table
r.db("my_finances").table('entries').orderBy('id').limit(25)
