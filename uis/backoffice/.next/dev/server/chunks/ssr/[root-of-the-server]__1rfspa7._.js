module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/uis/backoffice/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BackofficeHome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/uis/backoffice/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const inventory = [
    {
        sku: 'SHOE-BLK-42',
        name: 'Runner Black 42',
        warehouse: 'Los Ángeles',
        stock: 184,
        status: 'En rango',
        tone: 'ok'
    },
    {
        sku: 'SERUM-VIT-C',
        name: 'Sérum Vitamina C',
        warehouse: 'Zaragoza',
        stock: 32,
        status: 'Stock bajo',
        tone: 'warn'
    },
    {
        sku: 'HEADPHONES-X1',
        name: 'Auriculares X1',
        warehouse: 'Los Ángeles',
        stock: 96,
        status: 'En rango',
        tone: 'ok'
    },
    {
        sku: 'JACKET-OLIVE-M',
        name: 'Chaqueta Olive M',
        warehouse: 'Zaragoza',
        stock: 61,
        status: 'En rango',
        tone: 'ok'
    }
];
const carriers = [
    {
        name: 'SEUR',
        country: 'España · 1.240 envíos',
        rate: '96,4%',
        color: '#2f8b6a'
    },
    {
        name: 'UPS',
        country: 'Estados Unidos · 980 envíos',
        rate: '94,1%',
        color: '#ef795f'
    },
    {
        name: 'MRW',
        country: 'España · 740 envíos',
        rate: '91,8%',
        color: '#7d8ee8'
    },
    {
        name: 'FedEx',
        country: 'Estados Unidos · 620 envíos',
        rate: '89,7%',
        color: '#d09d3e'
    }
];
function BackofficeHome() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ops-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "sidebar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "brand",
                        children: [
                            "Track",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Flow"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 92
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/uis/backoffice/app/page.tsx",
                        lineNumber: 15,
                        columnNumber: 64
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "side-label",
                                children: "Operación"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 120
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "side-link active",
                                href: "#resumen",
                                children: "◈   Resumen"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 163
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "side-link",
                                href: "#inventario",
                                children: "▦   Inventario"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 231
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "side-link",
                                href: "#envios",
                                children: "↗   Envíos"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 298
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "side-link",
                                href: "#transportistas",
                                children: "◎   Transportistas"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 357
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "side-label",
                                children: "Empresa"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 432
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "side-link",
                                href: "#devoluciones",
                                children: "↩   Devoluciones"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 473
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "side-link",
                                href: "#alertas",
                                children: "!   Alertas"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 544
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/uis/backoffice/app/page.tsx",
                        lineNumber: 15,
                        columnNumber: 115
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/uis/backoffice/app/page.tsx",
                lineNumber: 15,
                columnNumber: 37
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "main",
                id: "resumen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "eyebrow",
                                        children: "TrackFlow Ops · Datos de demostración"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 687
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: "Buenos días, Ana."
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 755
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 682
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "date-pill",
                                children: "Actualizado hace 4 min · 09 sep 2026"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 787
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/uis/backoffice/app/page.tsx",
                        lineNumber: 15,
                        columnNumber: 655
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "kpi-grid",
                        "aria-label": "Indicadores principales",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-label",
                                        children: "Pedidos hoy"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 953
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        children: "2.840"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 997
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-note",
                                        children: "↑ 12,8% vs. ayer"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1035
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 932
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-label",
                                        children: "Entregas a tiempo"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1110
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        children: "94,6%"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1160
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-note",
                                        children: "↑ 1,2 pts esta semana"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1198
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 1089
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-label",
                                        children: "Stock bajo"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1278
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        children: [
                                            "18 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '1rem'
                                                },
                                                children: "SKUs"
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 1351
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1321
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-note",
                                        style: {
                                            color: '#ae5d27'
                                        },
                                        children: "5 requieren atención"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1403
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 1257
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "kpi",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-label",
                                        children: "Devoluciones"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1511
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-value",
                                        children: "21,3%"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1556
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "kpi-note",
                                        style: {
                                            color: '#7d8ee8'
                                        },
                                        children: "Dentro del rango 18–25%"
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1594
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 1490
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/uis/backoffice/app/page.tsx",
                        lineNumber: 15,
                        columnNumber: 865
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "content-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                id: "inventario",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Inventario por almacén"
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 1798
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "4 de 2.390 SKUs"
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 1829
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1767
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "inventory-table",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Producto"
                                                        }, void 0, false, {
                                                            fileName: "[project]/uis/backoffice/app/page.tsx",
                                                            lineNumber: 15,
                                                            columnNumber: 1909
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Almacén"
                                                        }, void 0, false, {
                                                            fileName: "[project]/uis/backoffice/app/page.tsx",
                                                            lineNumber: 15,
                                                            columnNumber: 1926
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Unidades"
                                                        }, void 0, false, {
                                                            fileName: "[project]/uis/backoffice/app/page.tsx",
                                                            lineNumber: 15,
                                                            columnNumber: 1942
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Estado"
                                                        }, void 0, false, {
                                                            fileName: "[project]/uis/backoffice/app/page.tsx",
                                                            lineNumber: 15,
                                                            columnNumber: 1959
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/uis/backoffice/app/page.tsx",
                                                    lineNumber: 15,
                                                    columnNumber: 1905
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 1898
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: inventory.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "sku",
                                                                        children: item.sku
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                        lineNumber: 15,
                                                                        columnNumber: 2042
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                        lineNumber: 15,
                                                                        columnNumber: 2081
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "warehouse",
                                                                        children: item.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                        lineNumber: 15,
                                                                        columnNumber: 2087
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                lineNumber: 15,
                                                                columnNumber: 2038
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: item.warehouse
                                                            }, void 0, false, {
                                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                lineNumber: 15,
                                                                columnNumber: 2138
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: item.stock
                                                            }, void 0, false, {
                                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                lineNumber: 15,
                                                                columnNumber: 2163
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `status ${item.tone}`,
                                                                    children: item.status
                                                                }, void 0, false, {
                                                                    fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                    lineNumber: 15,
                                                                    columnNumber: 2188
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                lineNumber: 15,
                                                                columnNumber: 2184
                                                            }, this)
                                                        ]
                                                    }, item.sku, true, {
                                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                                        lineNumber: 15,
                                                        columnNumber: 2019
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 1987
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 1863
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 1724
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                id: "transportistas",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Rendimiento de carriers"
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 2364
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Esta semana"
                                            }, void 0, false, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 2396
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 2333
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "carrier-list",
                                        children: carriers.map((carrier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "carrier-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "carrier-name",
                                                                style: {
                                                                    borderLeft: `3px solid ${carrier.color}`,
                                                                    paddingLeft: 9
                                                                },
                                                                children: carrier.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                lineNumber: 15,
                                                                columnNumber: 2536
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "carrier-meta",
                                                                children: carrier.country
                                                            }, void 0, false, {
                                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                                lineNumber: 15,
                                                                columnNumber: 2657
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                                        lineNumber: 15,
                                                        columnNumber: 2531
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rate",
                                                        children: carrier.rate
                                                    }, void 0, false, {
                                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                                        lineNumber: 15,
                                                        columnNumber: 2718
                                                    }, this)
                                                ]
                                            }, carrier.name, true, {
                                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                                lineNumber: 15,
                                                columnNumber: 2483
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/uis/backoffice/app/page.tsx",
                                        lineNumber: 15,
                                        columnNumber: 2426
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 2286
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/uis/backoffice/app/page.tsx",
                        lineNumber: 15,
                        columnNumber: 1694
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "alert-panel",
                        id: "alertas",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "5 alertas de stock requieren revisión"
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 2834
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$uis$2f$backoffice$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "El Sérum Vitamina C y cuatro SKUs más están por debajo del umbral configurado en Zaragoza. Revisa la reposición antes del próximo corte."
                            }, void 0, false, {
                                fileName: "[project]/uis/backoffice/app/page.tsx",
                                lineNumber: 15,
                                columnNumber: 2888
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/uis/backoffice/app/page.tsx",
                        lineNumber: 15,
                        columnNumber: 2792
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/uis/backoffice/app/page.tsx",
                lineNumber: 15,
                columnNumber: 619
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/uis/backoffice/app/page.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
}),
"[project]/uis/backoffice/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/uis/backoffice/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1rfspa7._.js.map