import{R as a}from"./index-BXjX_wEA.js";import{L as y}from"./index-Dq8e69U3.js";import"./index-DmiSGPmR.js";import"./index-BsAEaUOw.js";const i=({items:s,navLabel:b,labels:d})=>{const u={...{nav:"Breadcrumb"},...d},h=e=>e===s.length-1;return a.createElement("nav",{"aria-label":b||u.nav,className:"breadcrumb-nav"},a.createElement("ol",{className:"breadcrumb-list"},s.map((e,g)=>a.createElement("li",{key:e.path,className:"breadcrumb-item"},h(g)?a.createElement("span",{"aria-current":"page"},e.label):a.createElement(y,{to:e.path},e.label)))))};i.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:""},navLabel:{required:!1,tsType:{name:"string"},description:""},labels:{required:!1,tsType:{name:"BreadcrumbLabels"},description:""}}};const T={title:"Components/Breadcrumb",component:i,tags:["autodocs"]},r={args:{items:[{path:"/",label:"Home"},{path:"/library",label:"Library"},{path:"/library/data",label:"Data"},{path:"/library/data/reports",label:"Reports"}]}},t={args:{items:[{path:"/",label:"Home"},{path:"/settings",label:"Settings"}]}};var n,l,o;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    items: [{
      path: '/',
      label: 'Home'
    }, {
      path: '/library',
      label: 'Library'
    }, {
      path: '/library/data',
      label: 'Data'
    }, {
      path: '/library/data/reports',
      label: 'Reports'
    }]
  }
}`,...(o=(l=r.parameters)==null?void 0:l.docs)==null?void 0:o.source}}};var m,c,p;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    items: [{
      path: '/',
      label: 'Home'
    }, {
      path: '/settings',
      label: 'Settings'
    }]
  }
}`,...(p=(c=t.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const _=["Default","TwoLevels"];export{r as Default,t as TwoLevels,_ as __namedExportsOrder,T as default};
