import{R as g}from"./index-BXjX_wEA.js";import{fn as E}from"./index-DgAF9SIF.js";import{L as h}from"./index-Dq8e69U3.js";import"./index-DmiSGPmR.js";import"./index-BsAEaUOw.js";const p=({to:l,children:u,onClick:o,...f})=>{const y=n=>{const{key:r,shiftKey:R}=n;r==="Enter"&&o&&o(n),r==="F10"&&R&&n.preventDefault()};return g.createElement(h,{to:l,...f,onKeyDown:y},u)};p.__docgenInfo={description:"",methods:[],displayName:"AccessibleLink",props:{to:{required:!0,tsType:{name:"union",raw:"string | object",elements:[{name:"string"},{name:"object"}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.MouseEvent | React.KeyboardEvent) => void",signature:{arguments:[{type:{name:"union",raw:"React.MouseEvent | React.KeyboardEvent",elements:[{name:"ReactMouseEvent",raw:"React.MouseEvent"},{name:"ReactKeyboardEvent",raw:"React.KeyboardEvent"}]},name:"e"}],return:{name:"void"}}},description:""}}};const L={title:"Components/Link",component:p,tags:["autodocs"]},e={args:{to:"/destination",children:"Go to destination"}},t={args:{to:"/profile",onClick:E(),children:"View profile"}};var a,s,i;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    to: '/destination',
    children: 'Go to destination'
  }
}`,...(i=(s=e.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var c,d,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    to: '/profile',
    onClick: fn(),
    children: 'View profile'
  }
}`,...(m=(d=t.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const C=["Default","WithOnClick"];export{e as Default,t as WithOnClick,C as __namedExportsOrder,L as default};
