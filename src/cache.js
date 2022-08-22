import { InMemoryCache } from "@apollo/client";


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        movies: {
          keyArgs: ["type"],
          merge(existing, incoming, { readField }) {
            const movies = existing ? { ...existing.movies } : {};
            incoming.movies.forEach((movie) => {
              movies[`$${readField("id", movie)}`] = movie;
            });

           
            return {
              cursor: incoming.cursor,
              movies,
              hasMore:incoming.hasMore
            };
          },

          read(existing) {
            if (existing) {
            
              return {
                cursor: existing.cursor,
                movies: Object.values(existing.movies),
                hasMore: existing.hasMore,
              };
            }
          },
        },
      },
    },
  },
});


export default cache