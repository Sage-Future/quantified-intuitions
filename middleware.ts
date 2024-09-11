export { default } from "next-auth/middleware"
// Require login on matching URLs:
export const config = {
  matcher: [
    "/calibration",
    "/calibration/charts",
    "/((?!estimation-game/for-organisers)estimation-game/.+)", // estimation-game/anything, except for estimation-game/for-organisers
    "/pastcasting/charts",
    "/pastcasting/settings",
    "/pastcasting/multiplayer/:page*",
  ],
}
