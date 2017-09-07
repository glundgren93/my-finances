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

## Access rethinkdb
localhost:8080


### Get all data from table
r.db("my_finances").table('entries').orderBy('id').limit(25)
