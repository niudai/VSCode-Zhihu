import { b } from "./g_encrypt";
import * as md5 from "md5";

/**
 *
 * @param api api(去除https://zhihu.com后的部分)，可能携带参数,如：101_3_2.0+/api/v4/answers/529335326/voters+"AKCftBUl9BOPTrRxAbXw2tHou6s3tz8zIns=|1635581798"+{"type":"up"}
 * @param cookie cookie的某个字段
 * @param x_zse_93
 * @param cookieKey
 * @param dataArr 字符串数组，添加到末尾的其他字段
 * @returns
 */
export function genXZse96(
    api: string,
    cookie: string,
    dataArr: string[] = [],
    x_zse_93: string = "101_3_2.0",
    cookieKey: string = "d_c0="
) {
    const cookieStr = cookie.split(cookieKey)[1].split(";")[0];
    let tempStr = `${x_zse_93}+${api}+${cookieStr}`;
    let len = dataArr.length;
    if (len) {
        dataArr.map((item, index) => {
            tempStr += "+" + item;
        });
    }
    console.log({ tempStr });
    return `2.0_${b(md5(tempStr))}`;
}
