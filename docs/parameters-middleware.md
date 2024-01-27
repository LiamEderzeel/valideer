# Params middleware

The parameters middleware is to validate and parse the url paramters like `/users/:id`.

## Validate

The following example shows tho to define your parameters validation class
```ts 
import { IsObjectId } from "@valideer/koa";

export class ResourceIdParams {
	@IsObjectId()
	id: string;
}
```


:::code-group
```ts [koa]
import { router } from "koa"
import { validateParams } from "@valideer/koa"

const router = new Router();
const controller = new Controller;

router.get(
    "/",
    validateParams(UserParams),
    controller.getAll
);

```

The next example shows hot to type the route and assing the `validateParams` middleware. 
```ts [express]
import { Router } from "express";
import { validateAndParseParams } from "@valideer/koa"

const router = Router();
const controller = new LocationController();

router.get(
    "/", 
    validateAndParseParams(UserParams, parseUserParsedParams), 
    kcontroller.getAll
);

```
:::



## Validate and parse

The following example shows how to define you parameters validation class and parsed parameters class.
```ts 
import { IsObjectId } from "@valideer/koa";

export class ResourceIdParams {
	@IsObjectId()
	id: string;
}

export const parseResrouceIdParsedParams = (params: ResourceIdParams) => new ResrouceIdParsedParams(params);

export class ResrouceIdParsedParams {
	id: string;

	constructor(params: ResourceIdParams) {
		this.id = params.id;
	}
}
```

The next example shows hot to type the route and assing the `validateAndParseParams` middleware. 
:::code-group
```ts [koa]
import { router } from "koa"
import { validateAndParseParams } from "@valideer/koa";

const router = new Router();
const controller = new Controller;

router.get<null, IParsedParamsState<ResrouceIdParsedParams>(
    "/",
    validateAndParseParams(UserParams, parseUserParsedParams),
    controller.getAll
);

```

And the last example showing how to type the request handler and extract the parameters from the request state/locals.
```ts [express]
import { Router } from "express";
import { validateAndParseParams } from "@valideer/express";

const router = Router();
const controller = new LocationController();

router.get(
    "/", 
    validateAndParseParams(ResrouceIdParsedParams, parseResrouceIdParsedParams), 
    kcontroller.getAll
);

```
:::

:::code-group
```ts [koa]
import { Middleware } from "koa"
import { IParsedParamsState } from "@valideer/koa";

const getAll: Middleware<IParsedParamsState<ResrouceIdParsedParams>> = (ctx) => {
    const params = ctx.state.parsedParams

	const client = new MongoClient(uri);
	const cursor = await client.db("").collection("users").updateOne(_id: params.id, { $set: { name: "new name" }});
	const users = await cursor.toArray(),

    res.body = {users};
}
```

```ts [express]
import { RequestHandler } from "express"
import { IParsedQueryState } from "@valideer/koa";

const getAll: RequestHandler<null, null, null, null, IParsedParamsLocals<ResrouceIdParsedParams>> = async (req, res, next) => {
    const params = res.locals.parsedParams

	const client = new MongoClient(uri);
	const cursor = await client.db("").collection("users").updateOne(_id: params.id, { $set: { name: "new name" }});
	const users = await cursor.toArray(),

    return res.json({users});
};

```
:::
