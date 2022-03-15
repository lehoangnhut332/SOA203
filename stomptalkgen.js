import fnv1a from '@sindresorhus/fnv1a';
import * as fs from 'fs';

const guardgen = (text, name) => {
    let s = "// generated by stomptalkgen.js " + new Date().toJSON() + "\n";
    if (name) {
        s += "#ifndef stomptalk_method_h\n";
        s += "#define stomptalk_method_h\n\n";
        s += text;
        s += "#endif // stomptalk_method_h\n";
    } else {
        s += "#pragma once\n\n";
        s += text;
    }
    return s;
}

const reqgen = (text, hdr) => {
    let s = "";
    if (hdr.length) {
        for (let v of hdr) {
            s += "#include ";
            if (v[0] == "<")
                s += v;
            else
                s += "\"" + v + "\"";
            s += "\n";
        }
        s += '\n';
    }
    s += text;
    return s;
};


const hppgen = hdr => {
    let s = "#pragma once\n\n";
    if (hdr.length) {
        for (let v of hdr) {
            s += "#include ";
            if (v[0] == "<")
                s += v;
            else
                s += "\"" + v + "\"";
            s += "\n";
        }
        s += '\n';
    }
    return s;
};

const nsgen = (text, ns) => {
    let s = "";
    if (ns.length) {
        for (let v of ns) {
            s += "namespace " + v + " {\n";
        }
        s += "\n" + text;
        for (let v of ns) {
            s += "}\n";
        }
    }
    return s;
};

const m = [
    "ack",
    "nack",
    "send",
    "abort",
    "begin",
    "error",
    "stomp",
    "commit",
    "connect",
    "message",
    "receipt",
    "subscribe",
    "connected",
    "disconnect",
    "unsubscribe"
];

const method = m.sort();

const none = 0;
const unknown = "18446744073709551615";

const time = new Date().toJSON();
let path = "include/stomptalk/method.h"
// generate header
// let s = "";
// s += "#ifndef stomptalk_method_h\n";
// s += "#define stomptalk_method_h\n\n";
// s += "// generated by stomptalkgen.js " + time + "\n";
// s += "enum stomptalk_method {\n";
// s += "\tst_method_none = " + none + "ULL,\n";
// method.forEach(elem => {
//     const text = elem.toUpperCase();
//     s += "\tst_method_" + elem + " = " + fnv1a(text, {size: 64}).toString() + "ULL,\n";
// });
// s += "\tst_method_unknown = " + unknown + "ULL\n";
// s += "};\n\n";
// s += "#endif // stomptalk_method_h\n";


let s = "";
s += "#ifndef stomptalk_method_h\n";
s += "#define stomptalk_method_h\n\n";
s += "// generated by stomptalkgen.js " + time + "\n";
s += "#define st_method_none " + none + "ULL\n";
method.forEach(elem => {
    const text = elem.toUpperCase();
    s += "#define st_method_" + elem + " " + fnv1a(text, {size: 64}).toString() + "ULL\n";
});
s += "#define st_method_unknown " + unknown + "ULL\n\n";
s += "#endif // stomptalk_method_h\n";

//console.log(s);
fs.writeFileSync(path, s);


let last = "";
path = "include/stomptalk/tag/method.hpp"
s = "// generated by stomptalkgen.js " + time + "\n";
s += "using namespace std::literals;\n\n";
for (let i = 0, size = method.length; i < size; ++i) {
    const name = method[i];
    last = name;
    s += "struct " + name  + " {\n";
    if (i == 0)
        s += "\tconstexpr static auto num = 0;\n";
    else 
        s += "\tconstexpr static auto num = " + method[i - 1] + "::num + 1;\n";

    s += "\tconstexpr static auto text = \"" + name.toUpperCase() + "\"sv;\n";
    s += "\tconstexpr static auto text_size = text.size();\n";
    s += "\tconstexpr static auto text_hash = static_hash<" + name + ", st_method_" + name + ">::value;\n";
    s += "};\n\n";
}
s += "constexpr static auto count = " +  last + "::num + 1;\n\n";
s = nsgen(s, ["stomptalk", "method", "tag"]);
s = hppgen(["stomptalk/method.h", "stomptalk/fnv1a.hpp", "<string_view>", "<cstdint>"]) + s;
fs.writeFileSync(path, s);


const header_content_type = [
    "text/xml",
    "text/html",
    "text/plain",
    "application/xml",
    "application/json",
    "application/octet-stream"
];

const header_accept_version = [
    "1.2"
];

const header_ack = [
    "client",
    "client-individual"
];

const header_content_encodig = [
    "identity",
    "deflate",
    "compress",
    "gzip",
    "x-gzip",
    "br"
];

const h = [
    "content-length",
    "content-type",
    "accept-version",
    "host",
    "version",
    "login",
    "server",
    "passcode",
    "heart-beat",
    "destination",
    "id",
    "transaction",
    "message-id",
    "subscription",
    "receipt-id",
    "session",
    "ack",
    "receipt",
    "message",
    "prefetch-count",
    "durable",
    "auto_delete",
    "x-message-ttl",
    "expires",
    "x-max-length",
    "x-max-length-bytes",
    "x-dead-letter-exchange",
    "x-dead-letter-routing-key",
    "x-max-priority",
    "persistent",
    "reply-to",
    "redelivered",
    "x-original-exchange",
    "x-original-routing-key",
    "x-queue-name",
    "x-queue-type",
    "content-encoding",
    "priority",
    "correlation-id",
    "expiration",
    "amqp-message-id",
    "timestamp",
    "amqp_type",
    "user-id",
    "app-id",
    "cluster-id",
    "delivery-mode",
    "requeue"
];

const header = h.sort();

path = "include/stomptalk/header.h"
// generate header
s = "";
s += "#ifndef stomptalk_header_h\n";
s += "#define stomptalk_header_h\n\n";
s += "// generated by stomptalkgen.js " + time + "\n";
//s += "enum stomptalk_header {\n";
s += "#define st_header_none " + none + "ULL\n";

header.forEach(elem => {
    let text = elem;
    if (text.startsWith("x-"))
        text = text.slice(2);
    text = text.replaceAll("-", "_");
    s += "#define st_header_" + text + " " + fnv1a(elem, {size: 64}).toString() + "ULL\n";
});
s += "#define st_header_unknown " + unknown + "ULL\n\n";
//s += "};\n\n";
s += "#endif // stomptalk_header_h\n";
fs.writeFileSync(path, s);


const def_header = (elem, name, prev) => {
    let s = "";
    s += "struct " + name  + " {\n";
    if (prev == null)
        s += "\tconstexpr static auto num = 0;\n";
    else 
        s += "\tconstexpr static auto num = " + prev + "::num + 1;\n";
    s += "\tconstexpr static auto mask = 1ull << num;\n";
    s += "\tconstexpr static auto header = \"\\n" + elem + ":\"sv;\n";
    s += "\tconstexpr static auto header_size = header.size();\n";
    s += "\tconstexpr static auto text = header.substr(1, header_size - 2);\n";
    s += "\tconstexpr static auto text_size = text.size();\n";
    s += "\tconstexpr static auto text_hash = static_hash<" + name + ", st_header_" + name + ">::value;\n";
    return s;
}

const additional_header = (elem, arr, pref) => {
    let s = "";
    for (let i = 0, size = arr.length; i < size; ++i) {
        let text = arr[i];
        text = text.replaceAll("-", "_");
        text = text.replaceAll("/", "_");
        text = text.replaceAll(".", "");
        s += "\tconstexpr static auto header_" + pref + text + "() noexcept {\n";
        s += "\t\treturn \"\\n" + elem + ":" + arr[i] + "\"sv;\n";
        s += "\t}\n";
        s += "\tconstexpr static auto " + pref + text + "() noexcept {\n";
        s += "\t\treturn header_" + pref + text + "().substr(header_size);\n";
        s += "\t}\n";
    }
    return s;
}

const additional_boolean = (elem) => {
    let s = "";
    s += "\tconstexpr static auto header_enable() noexcept {\n";
    s += "\t\treturn \"\\n" + elem + ":true\"sv;\n";
    s += "\t}\n";
    s += "\tconstexpr static auto enable() noexcept {\n";
    s += "\t\treturn header_enable().substr(header_size);\n";
    s += "\t}\n";
    s += "\tconstexpr static auto header_disable() noexcept {\n";
    s += "\t\treturn \"\\n" + elem + ":false\"sv;\n";
    s += "\t}\n";
    s += "\tconstexpr static auto disable() noexcept {\n";
    s += "\t\treturn header_disable().substr(header_size);\n";
    s += "\t}\n";
    return s;
}

const custom_header = {
    "content-type": (elem, name)=>{
        return "\n" + additional_header(elem, header_content_type, "");
    },
    "accept-version": (elem, name)=>{
        return "\n" + additional_header(elem, header_accept_version, "v");
    },
    "version": (elem, name)=>{
        return "\n" + additional_header(elem, header_accept_version, "v");
    },
    "ack": (elem, name)=>{
        return "\n" + additional_header(elem, header_ack, "");
    },
    "auto-delete": (elem, name)=>{
        return "\n" + additional_boolean(elem);
    },
    "persistent": (elem, name)=>{
        return "\n" + additional_boolean(elem);
    },
    "content-encoding": (elem, name)=>{
        return "\n" + additional_header(elem, header_content_encodig, "");
    }
}


path = "include/stomptalk/tag/header.hpp"
s = "// generated by stomptalkgen.js " + time + "\n";
s += "using namespace std::literals;\n\n";

last = "";
for (let i = 0, size = header.length; i < size; ++i) {
    const name = header[i];
    const prev = (i == 0) ? null : header[i - 1];

    let cxx_name = name;
    if (cxx_name.startsWith("x-"))
        cxx_name = cxx_name.slice(2);
    cxx_name = cxx_name.replaceAll("-", "_");
    
    let cxx_prev = prev;
    if (cxx_prev != null) {
        if (cxx_prev.startsWith("x-"))
            cxx_prev = cxx_prev.slice(2);
        cxx_prev = cxx_prev.replaceAll("-", "_");
    }
    last = cxx_name;
    s += def_header(name, cxx_name, cxx_prev);
    if (custom_header.hasOwnProperty(name))
        s += custom_header[name](name, cxx_prev);

    s += "};\n\n";
}

s += "constexpr static auto count = " + last + "::num + 1;\n\n";
s = nsgen(s, ["stomptalk", "header", "tag"]);
s = hppgen(["stomptalk/header.h", "stomptalk/fnv1a.hpp", "<string_view>", "<cstdint>"]) + s;
fs.writeFileSync(path, s);