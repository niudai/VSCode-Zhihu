import { join } from "path";
import { PasteService } from "../../src/service/paste.service";

export function pasteServiceTest(pasteService: PasteService) {
    pasteService.uploadImageFromPath()
}