import { stringify } from 'query-string';
import { fetchUtils } from 'ra-core';

// @ts-ignore
const ADMIN_ROUTE = window.ADMIN_ROUTE;

const getTotal = (json, headers) => {
  if (!Array.isArray(json)) json = [json];
  let total = json.length;
  if (headers.has('X-Total-Count'))
    total = parseInt(headers.get('X-Total-Count').split('/').pop(), 10);
  return total;
};

const httpClient = (url, options = {}) => {
  if (!options.headers)
    options.headers = new Headers({
      accept: 'application/json',
      response: 'json',
    });

  // add your own headers here
  options.headers.set('token', localStorage.getItem('token'));
  options.headers.set('role', localStorage.getItem('role'));
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = (apiUrl) =>
  /** @type { import("react-admin").DataProvider } */
  ({
    getFromExtra: (resource, params) => {
      return new Promise(function (resolve, reject) {
        let url = `${resource}`;

        return httpClient(url, {
          method: 'GET',
        }).then(({ headers, json = [] }) => {
          // let total = getTotal(json, headers);
          console.log(json);
        });
      });
    },
    createOne: (resource, params) => {
      console.log('createOne');
    },
    getList: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const t = {
        ...fetchUtils.flattenObject(params.filter),
        _sort: field,
        _order: order,
      };

      const query = (page - 1) * perPage + '/' + perPage;
      let url = `${apiUrl}/${resource}/${query}?${stringify(t)}`;

      return httpClient(url).then(({ headers, json = [] }) => {
        const total = getTotal(json, headers);
        if (json && json[0]) {
          return {
            data: json.map((r, t) => ({ ...r, id: r._id, t })),
            total,
          };
        } else
          return {
            data: [],
            total: 0,
          };
      });
      // });
    },

    getOne: (resource, params) => {
      return httpClient(`${apiUrl}/${resource}/${params.id}`).then(
        ({ json }) => ({
          data: { ...json, id: json._id },
        })
      );
    },
    get: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`).then(({ json }) => ({
        data: json,
      })),

    getMany: (resource, params) =>
      Promise.all(
        params.ids.map((id) => httpClient(`${apiUrl}/${resource}/${id}`))
      ).then((res) => {
        return {
          data: res.map(({ json }) => ({ ...json, id: json._id })),
        };
      }),
    getManyReference: (resource, params) => {
      const { page, perPage } = params.pagination;

      const query = (page - 1) * perPage + '/' + perPage;
      const url = `${apiUrl}/${resource}/${query}`;

      return httpClient(url).then(({ headers, json }) => {
        let total = getTotal(json, headers);
        return {
          data: json,
          total,
        };
      });
    },

    update: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json = [] }) => ({
        data: { id: json._id, ...json },
      })),

    // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    updateMany: (resource, params) => {
      console.log('updateMany...', resource, params);
      return new Promise(function (resolve, reject) {
        // @ts-ignore
        if (params.id) {
          // @ts-ignore
          httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...params.data, selectedIds: params.ids }),
          }).then(({ json = [] }) => {
            return resolve({
              data: json,
            });
          });
        } else {
          httpClient(`${apiUrl}/${resource}/`, {
            method: 'PUT',
            body: JSON.stringify({ ...params.data, selectedIds: params.ids }),
          }).then(({ json = [] }) => {
            return resolve({
              data: json,
            });
          });
        }
      });
    },

    create: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`, {
        method: 'POST',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({
        data: { ...params.data, id: json._id },
      })),

    delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
      }).then(({ json }) => ({ data: json })),

    // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: 'DELETE',
          })
        )
      ).then((res) => ({ data: res.map(({ json }) => json._id) })),
  });

export default dataProvider(ADMIN_ROUTE);
