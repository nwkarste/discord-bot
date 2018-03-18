function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("TOKEN", process.env.BOT_TOKEN);
