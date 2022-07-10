/* eslint-disable */
// @ts-nocheck
/* 🌶️ This is a generated file, do not modify! */
import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Chat = Node & {
  __typename?: 'Chat';
  chat_id?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  recipient_uuid?: Maybe<Scalars['Int']>;
  room_id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Int']>;
  uuid?: Maybe<Scalars['Int']>;
};

export type City = Node & {
  __typename?: 'City';
  city_id: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  tile: Tile;
};

export type Log = Node & {
  __typename?: 'Log';
  id: Scalars['ID'];
  log_id: Scalars['Int'];
  text: Scalars['String'];
  timestamp: Scalars['Int'];
  type: Scalars['Int'];
  uuid: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  isShipSailing?: Maybe<Scalars['Boolean']>;
  setLog: Scalars['Int'];
  setShipPath?: Maybe<Scalars['String']>;
};


export type MutationIsShipSailingArgs = {
  ship_id: Scalars['Int'];
};


export type MutationSetLogArgs = {
  text: Scalars['String'];
  timestamp?: InputMaybe<Scalars['Int']>;
  type: Scalars['Int'];
};


export type MutationSetShipPathArgs = {
  shipPath: Scalars['String'];
  ship_id: Scalars['Int'];
};

export type Node = {
  id: Scalars['ID'];
};

export type Npc = Node & {
  __typename?: 'Npc';
  id: Scalars['ID'];
  path: Array<Tile>;
  ship_type: ShipType;
  should_repeat: Scalars['Boolean'];
  start_time: Scalars['Int'];
};

export type Path = Node & {
  __typename?: 'Path';
  id: Scalars['ID'];
  path: Scalars['String'];
  path_id: Scalars['Int'];
  ship_id: Scalars['Int'];
  start_time: Scalars['Int'];
};

export type Point = {
  x?: InputMaybe<Scalars['Int']>;
  y?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  getAllCities: Array<City>;
  getAllNpcs: Array<Npc>;
  getAllTiles: Array<Tile>;
  getChatHistory: Array<Chat>;
  getRecentLogs?: Maybe<Array<Maybe<Log>>>;
  getShipTypeFromId: ShipType;
  getShipsByUUID: Array<Ship>;
  getTileByID: Tile;
  getTilesAroundTile: Array<Tile>;
  getTilesWithinRectangle: Array<Tile>;
  getUserByUsername: User;
  verifyToken: Scalars['Boolean'];
};


export type QueryGetChatHistoryArgs = {
  room_id?: InputMaybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
};


export type QueryGetShipTypeFromIdArgs = {
  shipTypeId?: InputMaybe<Scalars['Int']>;
};


export type QueryGetShipsByUuidArgs = {
  uuid?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTileByIdArgs = {
  tileId?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTilesAroundTileArgs = {
  point?: InputMaybe<Point>;
  radius?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTilesWithinRectangleArgs = {
  pointA?: InputMaybe<Point>;
  pointB?: InputMaybe<Point>;
};


export type QueryGetUserByUsernameArgs = {
  username?: InputMaybe<Scalars['String']>;
};

export type Ship = Node & {
  __typename?: 'Ship';
  city: City;
  id: Scalars['ID'];
  is_sunk: Scalars['Boolean'];
  name: Scalars['String'];
  ship_id: Scalars['Int'];
  ship_type: ShipType;
  uuid: Scalars['Int'];
};

export type ShipType = Node & {
  __typename?: 'ShipType';
  attack_rating: Scalars['Int'];
  cargo_capacity: Scalars['Int'];
  id: Scalars['ID'];
  inventory_slots: Scalars['Int'];
  name: Scalars['String'];
  ship_type_id: Scalars['Int'];
  speed: Scalars['Int'];
};

export type Tile = Node & {
  __typename?: 'Tile';
  id: Scalars['ID'];
  tile_id: Scalars['Int'];
  type: TileTypes;
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export enum TileTypes {
  Forest = 'forest',
  Meadows = 'meadows',
  Mountains = 'mountains',
  Ocean = 'ocean'
}

export type User = Node & {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  time_created?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  uuid?: Maybe<Scalars['Int']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Chat: ResolverTypeWrapper<Chat>;
  City: ResolverTypeWrapper<City>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Log: ResolverTypeWrapper<Log>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Chat'] | ResolversTypes['City'] | ResolversTypes['Log'] | ResolversTypes['Npc'] | ResolversTypes['Path'] | ResolversTypes['Ship'] | ResolversTypes['ShipType'] | ResolversTypes['Tile'] | ResolversTypes['User'];
  Npc: ResolverTypeWrapper<Npc>;
  Path: ResolverTypeWrapper<Path>;
  Point: Point;
  Query: ResolverTypeWrapper<{}>;
  Ship: ResolverTypeWrapper<Ship>;
  ShipType: ResolverTypeWrapper<ShipType>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tile: ResolverTypeWrapper<Tile>;
  TileTypes: TileTypes;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Chat: Chat;
  City: City;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Log: Log;
  Mutation: {};
  Node: ResolversParentTypes['Chat'] | ResolversParentTypes['City'] | ResolversParentTypes['Log'] | ResolversParentTypes['Npc'] | ResolversParentTypes['Path'] | ResolversParentTypes['Ship'] | ResolversParentTypes['ShipType'] | ResolversParentTypes['Tile'] | ResolversParentTypes['User'];
  Npc: Npc;
  Path: Path;
  Point: Point;
  Query: {};
  Ship: Ship;
  ShipType: ShipType;
  String: Scalars['String'];
  Tile: Tile;
  User: User;
};

export type ChatResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Chat'] = ResolversParentTypes['Chat']> = {
  chat_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  recipient_uuid?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  room_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['City'] = ResolversParentTypes['City']> = {
  city_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tile?: Resolver<ResolversTypes['Tile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LogResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Log'] = ResolversParentTypes['Log']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  log_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  isShipSailing?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationIsShipSailingArgs, 'ship_id'>>;
  setLog?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationSetLogArgs, 'text' | 'type'>>;
  setShipPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSetShipPathArgs, 'shipPath' | 'ship_id'>>;
};

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Chat' | 'City' | 'Log' | 'Npc' | 'Path' | 'Ship' | 'ShipType' | 'Tile' | 'User', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NpcResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Npc'] = ResolversParentTypes['Npc']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['Tile']>, ParentType, ContextType>;
  ship_type?: Resolver<ResolversTypes['ShipType'], ParentType, ContextType>;
  should_repeat?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  start_time?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PathResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Path'] = ResolversParentTypes['Path']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ship_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  start_time?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllCities?: Resolver<Array<ResolversTypes['City']>, ParentType, ContextType>;
  getAllNpcs?: Resolver<Array<ResolversTypes['Npc']>, ParentType, ContextType>;
  getAllTiles?: Resolver<Array<ResolversTypes['Tile']>, ParentType, ContextType>;
  getChatHistory?: Resolver<Array<ResolversTypes['Chat']>, ParentType, ContextType, RequireFields<QueryGetChatHistoryArgs, 'timestamp'>>;
  getRecentLogs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Log']>>>, ParentType, ContextType>;
  getShipTypeFromId?: Resolver<ResolversTypes['ShipType'], ParentType, ContextType, Partial<QueryGetShipTypeFromIdArgs>>;
  getShipsByUUID?: Resolver<Array<ResolversTypes['Ship']>, ParentType, ContextType, Partial<QueryGetShipsByUuidArgs>>;
  getTileByID?: Resolver<ResolversTypes['Tile'], ParentType, ContextType, Partial<QueryGetTileByIdArgs>>;
  getTilesAroundTile?: Resolver<Array<ResolversTypes['Tile']>, ParentType, ContextType, Partial<QueryGetTilesAroundTileArgs>>;
  getTilesWithinRectangle?: Resolver<Array<ResolversTypes['Tile']>, ParentType, ContextType, Partial<QueryGetTilesWithinRectangleArgs>>;
  getUserByUsername?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<QueryGetUserByUsernameArgs>>;
  verifyToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type ShipResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Ship'] = ResolversParentTypes['Ship']> = {
  city?: Resolver<ResolversTypes['City'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_sunk?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ship_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ship_type?: Resolver<ResolversTypes['ShipType'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShipType'] = ResolversParentTypes['ShipType']> = {
  attack_rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cargo_capacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inventory_slots?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ship_type_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  speed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Tile'] = ResolversParentTypes['Tile']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tile_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TileTypes'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  time_created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Chat?: ChatResolvers<ContextType>;
  City?: CityResolvers<ContextType>;
  Log?: LogResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Npc?: NpcResolvers<ContextType>;
  Path?: PathResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Ship?: ShipResolvers<ContextType>;
  ShipType?: ShipTypeResolvers<ContextType>;
  Tile?: TileResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

