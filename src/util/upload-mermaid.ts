import { Base64 } from "js-base64";
import { PasteService } from "../service/paste.service";
const preUrl = `https://mermaid.ink/img/`;

const mermaidType = [
    "erDiagram",
    "graph TD",
    "sequenceDiagram",
    "classDiagram",
    "stateDiagram-v2",
    "stateDiagram",
    "gantt",
    "pie",
    "gitGraph",
    "journey",
];

interface MermaidDateStruct {
    picName: string;
    picData: string;
    picurl: string;
    isMermaid: boolean;
    zhihuUrl?: string;
}

function getImageNameAndRemove(data): MermaidDateStruct {
    data = data.trim();
    let imageNameReg = /\{imageName="(.+)"\}(\s*)\n/gm;
    let imageReg = /\{image="(.+)"\}(\s*)\n/gm;
    let picName = "";
    let picData = "";
    if (imageNameReg.test(data)) {
        picData = data.replace(
            imageNameReg,
            (match, p1, p2, p3, offset, string) => {
                picName = p1.trim() || "";
                return "";
            }
        );
    } else if (imageReg.test(data)) {
        picData = data.replace(
            imageReg,
            (match, p1, p2, p3, offset, string) => {
                picName = p1.trim() || "";
                return "";
            }
        );
    } else {
        picData = data;
    }

    const targetData = JSON.stringify({
        code: picData,
        mermaid: {
            theme: "dark",
        },
    });
    const picurl = preUrl + Base64.encodeURI(targetData);
    let isMermaid = false;
    for (let item of mermaidType) {
        if (picData.trim().startsWith(item)) {
            isMermaid = true;
            break;
        }
    }
    return {
        picName,
        picData,
        picurl,
        isMermaid,
    };
}

export const uploadMermaidToZhihu = async (text: string) => {
    const matchData = text.match(/```mermaid(.|\r\n)*?```/gm);
    const mermaidArr: MermaidDateStruct[] = [];
    matchData.map((item) => {
        item = item.replace("```mermaid", "").replace("```", "");
        const data = getImageNameAndRemove(item);
        mermaidArr.push(data);
    });
    let changeMd = text;
    for (let i = 0; i < matchData.length; i++) {
        const item = matchData[i];
        const dataItem = mermaidArr[i];
        if (dataItem.isMermaid) {
            // TODO 上传至知乎
            dataItem.zhihuUrl = await new PasteService().uploadImageFromLink(
                dataItem.picurl,
                false,
                "mermaid"
            );
            changeMd = changeMd.replace(
                item,
                `![${dataItem.picName}](${dataItem.zhihuUrl})`
            );
        }
    }
    return changeMd;
};
