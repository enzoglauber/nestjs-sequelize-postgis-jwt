
##

```bash
  npm install @nestjs/sequelize @nestjs/swagger @nestjs/config @nestjs/jwt @nestjs/passport passport-local passport-jwt sequelize sequelize-typescript pg pg-hstore class-transformer class-validator dotenv bcrypt joi

  npm install --save-dev @types/sequelize sequelize-cli ts-node tsconfig-paths
```

## Use this instead migration

```bash
  npx sequelize-cli migration:generate --name create-users-and-addresses
  npx sequelize-cli db:migrate

  npx sequelize-cli seed:generate --name seed-users-and-addresses
  npx sequelize-cli db:seed:all
```
