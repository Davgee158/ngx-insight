import { MOCK_CHOSEN_FOR_YOU } from "./mock-data";
import type { ChosenForYou } from "./types";

export async function getChosenForYou(): Promise<ChosenForYou> {
    return  MOCK_CHOSEN_FOR_YOU;
}