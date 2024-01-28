import { type CacheAdapter } from "remix-client-cache";

type Select<T, Store> = (loaderData: T) => Store;
type Transform<Store, T> = (store: Store | null, loaderData: T) => Store;

/**
 * Custom CacheAdapter that uses localStorage to handle infinite scroll pagination.
 *
 * `LoaderData` - The data returned from the loader function.
 *
 * `Store` - The data shape you want to store in localStorage. It is the return type of the select function and the first argument of the transform function.
 */
export class PaginationStore<LoaderData, Store extends Record<string, unknown>>
	implements CacheAdapter
{
	readonly key: string;

	// You can swap out localStorage for sessionStorage 😎
	private engine = typeof document !== "undefined" ? localStorage : undefined;
	private select: Select<LoaderData, Store>;
	private transform: Transform<Store, LoaderData>;

	/**
	 *
	 * **key** - The storage key to use.
	 *
	 * **select** - A function that selects the data you want to store from the loaderData.
	 *
	 * **transform** - A function that transforms the store and loaderData into a new store before saving.
	 */
	constructor({
		key,
		select,
		transform,
	}: {
		key: string;
		select: Select<LoaderData, Store>;
		transform: Transform<Store, LoaderData>;
	}) {
		this.key = key;
		this.select = select;
		this.transform = transform;
	}

	getItem(key = this.key): Store | null {
		const store = this.engine?.getItem(key);

		if (!store) {
			return null;
		}

		return this.select(JSON.parse(store));
	}

	setItem(key: string, value: LoaderData) {
		const store = this.getItem(key);

		return this.engine?.setItem(
			key,
			JSON.stringify(this.transform(store, value)),
		);
	}

	removeItem(key: string) {
		return this.engine?.removeItem(key);
	}
}

export function uniqueBy<Values extends Array<unknown>>(
	key: keyof Values[number],
	values: Values,
) {
	return [
		...new Map(
			values
				.filter(Boolean)
				.map((value: Values[number]) => [value[key], value]),
		).values(),
	];
}
