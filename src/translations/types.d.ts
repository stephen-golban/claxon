import type { locales } from "./locales/index";

type IsNested<T> = T extends string ? false : true;

type PathImpl<K extends string, V> = V extends string
	? `${K}`
	: `${K}:${Path<V>}`;

type TupleKeys<T extends Readonly<unknown>> = Exclude<keyof T, keyof unknown[]>;

type Path<T> = T extends Readonly<infer V>
	? IsNested<T> extends true
		? {
				[K in TupleKeys<T>]: PathImpl<K & string, T[K]>;
			}[TupleKeys<T>]
		: PathImpl<string, V>
	: never;

export type LocalesType = typeof locales;

export type I18nKey = Path<LocalesType[keyof LocalesType]>;
