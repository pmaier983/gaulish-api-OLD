import { GraphQLResolveInfo } from "graphql"
import { Context } from "../context"
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} & { [P in K]-?: NonNullable<T[P]> }
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>
  Chat: ResolverTypeWrapper<Chat>
  City: ResolverTypeWrapper<City>
  ID: ResolverTypeWrapper<Scalars["ID"]>
  Int: ResolverTypeWrapper<Scalars["Int"]>
  Mutation: ResolverTypeWrapper<{}>
  Node:
    | ResolversTypes["Chat"]
    | ResolversTypes["City"]
    | ResolversTypes["Ship"]
    | ResolversTypes["Tile"]
    | ResolversTypes["User"]
  Point: Point
  Query: ResolverTypeWrapper<{}>
  Ship: ResolverTypeWrapper<Ship>
  String: ResolverTypeWrapper<Scalars["String"]>
  Subscription: ResolverTypeWrapper<{}>
  Tile: ResolverTypeWrapper<Tile>
  TileTypes: TileTypes
  User: ResolverTypeWrapper<User>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars["Boolean"]
  Chat: Chat
  City: City
  ID: Scalars["ID"]
  Int: Scalars["Int"]
  Mutation: {}
  Node:
    | ResolversParentTypes["Chat"]
    | ResolversParentTypes["City"]
    | ResolversParentTypes["Ship"]
    | ResolversParentTypes["Tile"]
    | ResolversParentTypes["User"]
  Point: Point
  Query: {}
  Ship: Ship
  String: Scalars["String"]
  Subscription: {}
  Tile: Tile
  User: User
}

export type ChatResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Chat"] = ResolversParentTypes["Chat"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  text?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  time?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  username?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CityResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["City"] = ResolversParentTypes["City"]
> = {
  city_id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  tile?: Resolver<ResolversTypes["Tile"], ParentType, ContextType>
  tile_id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  chatGlobally?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationChatGloballyArgs, "text" | "username">
  >
}

export type NodeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Node"] = ResolversParentTypes["Node"]
> = {
  __resolveType: TypeResolveFn<
    "Chat" | "City" | "Ship" | "Tile" | "User",
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  getAllCities?: Resolver<
    Array<Maybe<ResolversTypes["City"]>>,
    ParentType,
    ContextType
  >
  getAllTiles?: Resolver<Array<ResolversTypes["Tile"]>, ParentType, ContextType>
  getShipsByUUID?: Resolver<
    Array<Maybe<ResolversTypes["Ship"]>>,
    ParentType,
    ContextType,
    RequireFields<QueryGetShipsByUuidArgs, never>
  >
  getTileByID?: Resolver<
    ResolversTypes["Tile"],
    ParentType,
    ContextType,
    RequireFields<QueryGetTileByIdArgs, never>
  >
  getTilesAroundTile?: Resolver<
    Array<ResolversTypes["Tile"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetTilesAroundTileArgs, never>
  >
  getTilesWithinRectangle?: Resolver<
    Array<ResolversTypes["Tile"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetTilesWithinRectangleArgs, never>
  >
  getUserByUsername?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<QueryGetUserByUsernameArgs, never>
  >
  verifyToken?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export type ShipResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Ship"] = ResolversParentTypes["Ship"]
> = {
  city_id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  ship_id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  ship_type_id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  uuid?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubscriptionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = {
  globalChat?: SubscriptionResolver<
    ResolversTypes["Chat"],
    "globalChat",
    ParentType,
    ContextType
  >
}

export type TileResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Tile"] = ResolversParentTypes["Tile"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  tile_id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  type?: Resolver<ResolversTypes["TileTypes"], ParentType, ContextType>
  x?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  y?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  time_created?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >
  username?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>
  uuid?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = Context> = {
  Chat?: ChatResolvers<ContextType>
  City?: CityResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Node?: NodeResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Ship?: ShipResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  Tile?: TileResolvers<ContextType>
  User?: UserResolvers<ContextType>
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Chat = Node & {
  __typename?: "Chat"
  id: Scalars["ID"]
  text: Scalars["String"]
  time: Scalars["String"]
  username?: Maybe<Scalars["String"]>
}

export type City = Node & {
  __typename?: "City"
  city_id: Scalars["Int"]
  id: Scalars["ID"]
  name: Scalars["String"]
  tile: Tile
  tile_id: Scalars["Int"]
}

export type Mutation = {
  __typename?: "Mutation"
  chatGlobally?: Maybe<Scalars["Boolean"]>
}

export type MutationChatGloballyArgs = {
  text: Scalars["String"]
  username: Scalars["String"]
}

export type Node = {
  id: Scalars["ID"]
}

export type Point = {
  x?: Maybe<Scalars["Int"]>
  y?: Maybe<Scalars["Int"]>
}

export type Query = {
  __typename?: "Query"
  getAllCities: Array<Maybe<City>>
  getAllTiles: Array<Tile>
  getShipsByUUID: Array<Maybe<Ship>>
  getTileByID: Tile
  getTilesAroundTile: Array<Tile>
  getTilesWithinRectangle: Array<Tile>
  getUserByUsername: User
  verifyToken: Scalars["Boolean"]
}

export type QueryGetShipsByUuidArgs = {
  username?: Maybe<Scalars["Int"]>
}

export type QueryGetTileByIdArgs = {
  tileId?: Maybe<Scalars["Int"]>
}

export type QueryGetTilesAroundTileArgs = {
  point?: Maybe<Point>
  radius?: Maybe<Scalars["Int"]>
}

export type QueryGetTilesWithinRectangleArgs = {
  pointA?: Maybe<Point>
  pointB?: Maybe<Point>
}

export type QueryGetUserByUsernameArgs = {
  username?: Maybe<Scalars["String"]>
}

export type Ship = Node & {
  __typename?: "Ship"
  city_id: Scalars["Int"]
  id: Scalars["ID"]
  name: Scalars["String"]
  ship_id: Scalars["Int"]
  ship_type_id: Scalars["Int"]
  uuid: Scalars["Int"]
}

export type Subscription = {
  __typename?: "Subscription"
  globalChat: Chat
}

export type Tile = Node & {
  __typename?: "Tile"
  id: Scalars["ID"]
  tile_id: Scalars["Int"]
  type: TileTypes
  x: Scalars["Int"]
  y: Scalars["Int"]
}

export enum TileTypes {
  Forest = "forest",
  Meadows = "meadows",
  Mountains = "mountains",
  Ocean = "ocean",
}

export type User = Node & {
  __typename?: "User"
  email?: Maybe<Scalars["String"]>
  id: Scalars["ID"]
  time_created?: Maybe<Scalars["String"]>
  username?: Maybe<Scalars["String"]>
  uuid?: Maybe<Scalars["Int"]>
}
