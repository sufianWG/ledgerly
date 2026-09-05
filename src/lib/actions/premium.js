"use server";

import { serverMutation } from "../core/server";

export const upgradeToPremium = async () => {
    return serverMutation("/users/upgrade", {});
}
