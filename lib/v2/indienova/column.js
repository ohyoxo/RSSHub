import got from '@/utils/got';
import { load } from 'cheerio';
const { baseUrl, parseList, parseItem } = require('./utils');

module.exports = async (ctx) => {
    const { columnId } = ctx.params;

    const { data: response, url: link } = await got(`${baseUrl}/column/${columnId}`);
    const $ = load(response);

    const list = parseList($);

    const items = await Promise.all(list.map((item) => ctx.cache.tryGet(item.link, () => parseItem(item))));

    ctx.set('data', {
        title: $('head title').text(),
        link,
        item: items,
    });
};