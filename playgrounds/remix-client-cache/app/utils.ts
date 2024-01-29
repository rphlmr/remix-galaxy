import { type CacheAdapter } from "remix-client-cache";

type Select<T, Store> = (loaderData: T) => Store;
type Transform<Store, T> = (
	store: Store | undefined,
	loaderData: T | Store,
) => Store;

/**
 * Custom CacheAdapter that uses localStorage to handle infinite scroll pagination or whatever you want, if you only want to store some slice of data from the loaderData.
 *
 * `LoaderData` - The data returned from the loader function.
 *
 * `Store` - The data shape you want to store in localStorage. It is the return type of the select function and the first argument of the transform function.
 */
export class CacheStorage<LoaderData, Store extends Record<string, unknown>>
	implements CacheAdapter
{
	readonly key: string;

	// You can swap out localStorage for sessionStorage 😎
	private engine: CacheAdapter | undefined;
	private select: Select<LoaderData, Store>;
	private transform: Transform<Store, LoaderData>;

	/**
	 *
	 * **key** - The storage key to use.
	 *
	 * **select** - A function that selects the data you want to store from the loaderData.
	 *
	 * **transform** - A function that transforms the store and loaderData | previousStore into a new store before saving.
	 */
	constructor({
		key,
		select,
		transform,
		engine,
	}: {
		key: string;
		select: Select<LoaderData, Store>;
		transform: Transform<Store, LoaderData>;
		engine: CacheAdapter | undefined;
	}) {
		this.key = key;
		this.select = select;
		this.transform = transform;
		this.engine = engine;
	}

	getItem(key = this.key) {
		const store = this.engine?.getItem(key);

		if (!store) {
			return;
		}

		return this.select(JSON.parse(store));
	}

	/**
	 * setItem can receive existing store data or new data from loader
	 */
	setItem(key: string, newData: LoaderData | Store) {
		const store = this.getItem(key);

		return this.engine?.setItem(
			key,
			JSON.stringify(this.transform(store, newData)),
		);
	}

	removeItem(key: string) {
		return this.engine?.removeItem(key);
	}
}
