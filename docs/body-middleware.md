# Body middleware

The parameters middleware is to validate and parse the url paramters like `/users/:id`.

## Validate

The following example shows tho to define your body validation class
```ts 
export class UserCreateBody {
	@IsObjectId()
	firstname: string;
	lastname: string;
}
```


:::code-group
```ts [koa]
import { router } from "koa"
import { validateBody } from "@valideer/koa"

const router = new Router();
const controller = new Controller;

router.get(
    "/",
    validateBody(UserParams),
    controller.getAll
);

```

The next example shows hot to type the route and assing the `validateBody` middleware. 
```ts [express]
import { Router } from "express";
import { validateAndParseBody } from "@valideer/koa"

const router = Router();
const controller = new LocationController();

router.get(
    "/", 
    validateAndParsePBody(UserBody, parseUserParsedBody), 
    kcontroller.getAll
);

```
:::

## Validate and parse

The following example shows how to define you body validation class and parsed body class.
```ts 
export class UserCreateBody {
	@IsObjectId()
	firstname: string;
	lastname: string;
}

export const parseResrouceIdParsedBody = (body: UserCreateBody) => new ResourceIdParams(params);

export class UserCreateParsedParams {
	firstname: string;
	lastname: string;

	constructor(body: ResourceIdParams) {
		this.firstname = body.firstname;
		this.lastname = body.lastname;
	}
}
```

The next example shows hot to type the route and assing the `validateAndParseBody` middleware. 
:::code-group
```ts [koa]
import { router } from "koa"
import { validateAndParseParams } from "@valideer/koa";

const router = new Router();
const controller = new Controller;

router.get<null, IParsedBodyState<UserCreateParsedBody>>(
    "/",
    validateAndParseParams(UserCreateBody, parseResrouceIdParsedBody),
    controller.getAll
);

```

And the last example showing how to type the request handler and extract the body from the request state/locals.
```ts [express]
import { Router } from "express";
import { validateAndParseBody } from "@valideer/express";

const router = Router();
const controller = new LocationController();

router.get(
    "/", 
    validateAndParseBody(ResrouceIdParams, parseResrouceIdParsedBody), 
    kcontroller.getAll
);

```
:::

:::code-group
```ts [koa]
import { Middleware } from "koa"
import { IParsedParamsState } from "@valideer/koa";

const getAll: Middleware<IParsedBodyState<UserCreateParsedBody>> = (ctx) => {
    const user = ctx.state.parsedBody

	const client = new MongoClient(uri);
	await client.db("").collection("users").insertOne(user);

    res.status = 201;
}
```

```ts [express]
import { RequestHandler } from "express"
import { IParsedQueryState } from "@valideer/koa";

const getAll: RequestHandler<null, null, null, null, IParsedBodyState<UserCreateParsedBody>> = async (req, res, next) => {
    const params = res.locals.parsedBody

	const client = new MongoClient(uri);
	await client.db("").collection("users").insertOne(user);

    return res.sendStatus(201);
};

```
:::
