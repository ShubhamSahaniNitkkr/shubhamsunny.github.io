var e={brand:`Shubham Sunny`,tagline:`Website Modernization for US Businesses`,location:`Remote · US Time Zones Welcome`,phone:`+91 97718 23804`,whatsapp:`919771823804`,email:`shubhamsahaninitkkr@gmail.com`,address:`Remote · Serving US & Global Clients`,domain:`https://shubhamsunny.com`,seo:{title:`Shubham Sunny | Website Modernization for US Businesses`,description:`I modernize outdated business websites for US owners. Mobile-friendly, fast, trustworthy. 8+ years, 50+ projects. Free WhatsApp consult.`,keywords:`website modernization, small business website redesign, outdated website makeover, US web developer, mobile friendly website`,ogImage:`/media/team/shubham.jpg`},stats:{happyClients:40,projectsDelivered:50,yearsExperience:8,googleRating:4.9},certifications:[`NIT Kurukshetra · 8+ Years Experience`],whatsappMessages:{consultation:`Hi Shubham,

I saw your website and I'd like a free review of my business website.

Thanks!`,package:`Hi Shubham,

I'm interested in the {packageName} package (\${price}). Can we discuss?

Thanks!`,general:`Hi Shubham,

I visited your website and would like to know more about website modernization.

Thanks!`,payment:`Hi Shubham, I have a question about getting started. Name: {name}, Package: {package}.`},emailMessages:{consultation:`Hi Shubham,

I saw your website and I'd like a free review of my business website.

Thanks!`,package:`Hi Shubham,

I'm interested in the {packageName} package (\${price}). Can we discuss?

Thanks!`,general:`Hi Shubham,

I visited your website and would like to know more about website modernization.

Thanks!`,payment:`Hi Shubham, I have a question about getting started. Name: {name}, Package: {package}.`}};function t(t,n){return`https://mail.google.com/mail/?${new URLSearchParams({view:`cm`,fs:`1`,to:e.email,su:t,body:n}).toString()}`}function n(){return t(`Free Website Review Request`,e.emailMessages?.consultation||e.whatsappMessages?.consultation||``)}function r(e,n,r,i){let a=e.trim()||`Website visitor`;return t(`Website chat — ${a}`,[`Hi Shubham,`,``,r.trim(),``,`---`,`Name: ${a}`,n.trim()?`Reply-to: ${n.trim()}`:`Reply-to: (not provided)`,`Page: ${i||`/`}`,`Sent via website chat`].join(`
`))}function i(){let e=``.replace(/\/$/,``);return e?`${e}/api/visit`:`/api/visit`}function a(e){return/\.(mp4|mov|webm)(\?|$)/i.test(e)}function o(e,t=800,n){if(!e)return e;if(e.includes(`cloudinary.com`)){if(a(e))return e;let r=n?`c_fill,w_${t},h_${n},g_face,q_auto,f_auto`:`c_limit,w_${t},q_auto,f_auto`;return e.replace(`/upload/`,`/upload/${r}/`)}return e}export{e as a,i,o as n,n as r,r as t};