# Query middleware
The query middleware is to validate and parse the url query like `/users?limit=10&skip=30`.

## Validate

The following example shows tho to define your query validation class
```ts 
export class UserQuery {
	@IsNumberString()
	offset?: string;

	@IsNumberString()
	limit?: string;
}
```


:::code-group
```ts [koa]
import { router } from "koa"
import { validateQuery } from "@valideer/koa";

const router = new Router();
const controller = new Controller;

router.get(
    "/",
    validateQuery(UserQuery),
    controller.getAll
);

```

The next example shows hot to type the route and assing the `validateQuery` middleware. 
```ts [express]
import { Router } from "express";
import { validateAndParseQuery } from "@valideer/express";

const router = Router();
const controller = new LocationController();

router.get(
    "/", 
    validateAndParseQuery(UserQuery, parseUserParsedQuery), 
    kcontroller.getAll
);

```
:::


## Validate and parse

The following example shows how to define you query validation class and parsed query class.
```ts 
export class UserQuery {
	@IsNumberString()
	offset?: string;

	@IsNumberString()
	limit?: string;
}

export const parseUserParsedQuery = (query: UserQuery) => new UserParsedQuery(query);

export class UserParsedQuery implements IPaginationOptions {
	limitMax = 100;

	options: {
		limit: number;
		skip: number;
	} = {
		limit: 32,
		skip: 0,
	};

    filter: {
        id?: number
    }

	constructor(query: UserQuery) {
		if (query.limit) this.options.limit = Math.max(0, Math.min(parseInt(query.limit, 10), this.limitMax));
		if (query.offset) this.options.skip = parseInt(query.offset, 10);
	}

}
```

The next example shows hot to type the route and assing the `validateAndParseQuery` middleware. 
:::code-group
```ts [koa]
import { router } from "koa"
import { validateAndParseQuery } from "@valideer/koa";


const router = new Router();
const controller = new Controller;

router.get<null, IParsedQueryState<UserParsedQuery>(
    "/",
    validateAndParseQuery(UserQuery, parseUserParsedQuery),
    controller.getAll
);

```

```ts [express]
import { Router } from "express";
import { validateAndParseQuery } from "@valideer/express";


const router = Router();
const controller = new LocationController();

router.get(
    "/", 
    validateAndParseQuery(UserQuery, parseUserParsedQuery), 
    kcontroller.getAll
);

```
:::

And the last example showing how to type the request handler and extract the query from the request state/locals.

:::code-group
```ts [koa]
import { Middleware } from "koa"
import { IParsedQueryState } from "@valideer/koa";

const getAll: Middleware<IParsedQueryState<LocationQueryParsed>> = (ctx) => {
    const query = ctx.state.parsedQuery

	const client = new MongoClient(uri);
	const cursor = await client.db("").collection("users").find(query.filter, query.options);
	const users = await cursor.toArray(),

    res.body = {users};
}
```

```ts [express]
import { RequestHandler } from "express"
import { IParsedQueryState } from "@valideer/koa";

const getAll: RequestHandler<null, null, null, null, IParsedQueryState<LocationQueryParsed>> = async (req, res, next) => {
    const query = res.locals.parsedQuery

	const client = new MongoClient(uri);
	const cursor = await client.db("").collection("users").find(query.filter, query.options);
	const users = await cursor.toArray(),

    return res.json({users});
};

```
:::
