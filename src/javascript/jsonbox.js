import axios from 'axios';

export default class JsonBox {
    constructor(url, collection = null) {
        this.url = url;
        this.collection = collection;
    }

    async add(data) {
        const resp = await axios.post(this.endpoint, data);
        return resp.data;
    }

    async ofId(id) {
        const resp = await axios.get(this.endpoint + '/' + id);
        return resp.data;
    }
    async all(searchString) {
        
        const resp = await axios.get(this.endpoint+'?sort=name');
        return resp.data;
        
        
    }

    async update(id, data) {
        await axios.put(this.endpoint + '/' + id, data);
    }

    async delete(id) {
        await axios.delete(this.endpoint + '/' + id);
    }

    async search(params) {
        const queryString = this.buildQueryString(params);
        const resp = await axios.get(this.endpoint, {
            params: {
                q: queryString
            }
        });

        return resp.data;
    }

    buildQueryString(params) {
        let query = '';
        for (let prop in params) {
            query += `${prop}:${params[prop]},`;
        }

        query = query.slice(0, -1);

        return query;
    }


    get endpoint() {
        return this.url + (this.collection ? '/' + this.collection : '');
    }
}