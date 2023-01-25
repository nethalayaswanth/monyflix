import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import usePrevious from "../hooks/usePrevious";

export const ImagesContext = createContext();
export function ImagesProvider({ children, client }) {
  return (
    <ImagesContext.Provider value={client}>{children}</ImagesContext.Provider>
  );
}

export class ImagesClient {
  constructor() {
    this.queries = [];
  }

  getQuery = (options) => {

    const hash = options.src;
    let query = this.queries.find((d) => d.hash === hash);
    if (!query) {
      query = createQuery(this, options);
      this.queries.push(query);
    }
    return query;
  };
}

export const useImage = (options) => {
  const client = useContext(ImagesContext);


  const [_, renderer] = useReducer((i) => i + 1, 0);

  const observerRef = useRef();
  const unsubscribe=useRef()

  const prevOptions=usePrevious(options)


const keyChanged=prevOptions?.src===options.src

  if (!observerRef.current || keyChanged) {
    if(unsubscribe.current){
       unsubscribe.current()
    }
    observerRef.current = createQueryObserver(client, options);
    unsubscribe.current = observerRef.current.subscribe(renderer);
  }
 
  useEffect(() => {
    return unsubscribe.current;
  }, []);


  return observerRef.current.getResult();
};
function createQuery(client, { src, preview }) {

    console.log(src,preview)
  let query = {
    promise: null,
    hash: src,
    state: {
      isLoading: true,
      status: "loading",
      data: preview,
    },
    subscribers: [],
    setState: (updater) => {
      query.state = updater(query.state);
      query.subscribers.forEach((subscriber) => {
        subscriber.notify();
      });
    },
    subscribe: (subscriber) => {
      query.subscribers.push(subscriber);

      return () => {
       query.subscribers=  query.subscribers.filter((d) => d !== subscriber);
      };
    },
    fetch: async () => {
      if (!query.promise) {
        query.promise = (async () => {
          query.setState((old) => ({
            ...old,
            status: "loading",
            isLoading: true,
            error: undefined,
          }));

          try {
            const img = new Image();
            img.onload = () => {
              query.setState((old) => ({
                ...old,
                data: src,
                status: "success",
                isLoading: false,
                error: undefined,
              }));
            };
            img.src = src;
          } catch (error) {
            query.setState((old) => ({
              ...old,
              status: "error",
              isLoading: false,
              error,
            }));
          } finally {
            query.promise = null;
            query.setState((old) => ({
              ...old,
              isLoading: false,
            }));
          }
        })();
      }
    },
  };

  return query
}

function createQueryObserver(client,options) {
  const query = client.getQuery(options);

  const observer = {
    notify: () => {},
    getResult: () => query.state,
    subscribe: (callback) => {
      observer.notify = callback;
  
      const unsubscribe = query.subscribe(observer);
      
      query.fetch();
      return unsubscribe;
    },
  };

  return observer
}
