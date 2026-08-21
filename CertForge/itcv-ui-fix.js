(function(){
  'use strict';

  var STYLE_ID='itcv-visual-layout-fix';
  var EXPECTED_CERTIFICATION_COUNT=332;
  var catalogNormalized=false;
  var navRendering=false;

  var VENDOR_ORDER=[
    'CompTIA','Cisco','Microsoft','AWS','PeopleCert / ITIL','Google Cloud',
    'Red Hat','HPE / Juniper Networking','Fortinet','Palo Alto Networks',
    'ISC2','ISACA','GIAC / SANS','OffSec','Linux Foundation / CNCF',
    'HashiCorp','VMware / Broadcom','Nutanix','CrowdStrike','Splunk',
    'Oracle','Salesforce','Snowflake','Databricks','Check Point',
    'EC-Council','PMI','ServiceNow','IBM','Dell Technologies','NVIDIA','F5'
  ];

  function clean(value){
    return String(value==null?'':value).replace(/\s+/g,' ').trim();
  }

  function esc(value){
    return clean(value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '.itcv-visual-card-fixed{overflow:visible!important;}',
      '.itcv-visual-media-shell-fixed{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;aspect-ratio:auto!important;}',
      '.itcv-visual-media-fixed{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center center!important;margin-left:auto!important;margin-right:auto!important;clip-path:none!important;}',
      '.itcv-fullsize-control-wrap{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;width:100%!important;height:auto!important;display:flex!important;justify-content:center!important;align-items:center!important;margin:10px 0 0!important;padding:0!important;pointer-events:auto!important;}',
      '.itcv-fullsize-control{position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;float:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:max-content!important;max-width:calc(100% - 24px)!important;height:auto!important;margin:10px auto 0!important;z-index:2!important;white-space:normal!important;}',
      '[data-nav][data-itcv-canonical-nav="ready"] .itcv-v9-provider{display:block!important;}',
      '[data-nav][data-itcv-canonical-nav="ready"] .itcv-v9-provider-certs{display:none;}',
      '[data-nav][data-itcv-canonical-nav="ready"] .itcv-v9-provider.open>.itcv-v9-provider-certs{display:block;}',
      '@media (max-width:700px){.itcv-fullsize-control{max-width:calc(100% - 16px)!important}.itcv-visual-media-fixed{width:100%!important;height:auto!important;}}'
    ].join('');
    (document.head||document.documentElement).appendChild(style);
  }

  function isFullSizeControl(el){
    return /view\s+full\s+size/i.test(clean(el&&el.textContent));
  }

  function markControl(control){
    if(!control||!control.classList||!isFullSizeControl(control)) return;
    control.classList.add('itcv-fullsize-control');

    var immediate=control.parentElement;
    if(immediate&&!immediate.querySelector('img,svg')) immediate.classList.add('itcv-fullsize-control-wrap');

    var node=immediate;
    var card=null;
    for(var i=0;i<7&&node&&node!==document.body;i++,node=node.parentElement){
      if(node.querySelector&&node.querySelector('img,svg')){card=node;break;}
    }
    if(!card) return;

    card.classList.add('itcv-visual-card-fixed');
    card.querySelectorAll('img,svg').forEach(function(media){
      media.classList.add('itcv-visual-media-fixed');
      var shell=media.parentElement;
      if(shell&&shell!==card) shell.classList.add('itcv-visual-media-shell-fixed');
    });
  }

  function vendorFromText(cert){
    var raw=clean(cert&&(cert.providerGroup||cert.vendor||cert.provider||cert.issuer||cert.organization||cert.company));
    var text=clean([
      raw,cert&&cert.id,cert&&cert.code,cert&&cert.examCode,cert&&cert.name,
      cert&&cert.title,cert&&cert.desc,cert&&cert.description
    ].join(' '));
    var s=text.toLowerCase();

    if(/\bcomptia\b/.test(s)) return 'CompTIA';
    if(/\bcisco\b|\bccna\b|\bccnp\b|\bccie\b|\bccst\b|\bencor\b|\bscor\b|\bdccor\b|\bspcor\b|\bclcor\b|\bautocor\b|\bwlcor\b|\bcbrcor\b/.test(s)) return 'Cisco';
    if(/\bmicrosoft\b|\bazure\b|\bm365\b|\bpower platform\b|\bdynamics 365\b|\bentra\b|\bfabric\b/.test(s)) return 'Microsoft';
    if(/\bamazon web services\b|\baws\b/.test(s)) return 'AWS';
    if(/\bpeoplecert\b|\bitil\b/.test(s)) return 'PeopleCert / ITIL';
    if(/\bgoogle cloud\b|\bgcp\b|\bgoogle workspace\b/.test(s)) return 'Google Cloud';
    if(/\bred hat\b|\brhcsa\b|\brhce\b|\bopenshift\b/.test(s)) return 'Red Hat';
    if(/\bjuniper\b|\bjunos\b|\bjNCIA\b|\bjNCIS\b|\bjNCIP\b|\bjNCIE\b|\bhpe\b|\bhewlett packard enterprise\b|\baruba\b/.test(s)) return 'HPE / Juniper Networking';
    if(/\bfortinet\b|\bfortigate\b|\bnse\s*[1-8]\b/.test(s)) return 'Fortinet';
    if(/\bpalo alto\b|\bpan-os\b|\bpcnsa\b|\bpcnse\b/.test(s)) return 'Palo Alto Networks';
    if(/\bisc2\b|\b\(isc\)2\b|\bcissp\b|\bccsp\b|\bsscp\b|\bcsslp\b|\bcgrc\b/.test(s)) return 'ISC2';
    if(/\bisaca\b|\bcisa\b|\bcism\b|\bcrisc\b|\bcgeit\b/.test(s)) return 'ISACA';
    if(/\bgiac\b|\bsans\b|\bgsec\b|\bgcih\b|\bgpen\b|\bgcfa\b|\bgmon\b|\bgwapt\b/.test(s)) return 'GIAC / SANS';
    if(/\boffsec\b|\boffensive security\b|\boscp\b|\bosep\b|\boswe\b|\bosce\b|\boswp\b/.test(s)) return 'OffSec';
    if(/\blinux foundation\b|\bcncf\b|\bkubernetes\b|\bcka\b|\bckad\b|\bcks\b|\bkcna\b|\bkcsa\b|\blfcs\b|\blfca\b/.test(s)) return 'Linux Foundation / CNCF';
    if(/\bhashicorp\b|\bterraform\b|\bvault\b/.test(s)) return 'HashiCorp';
    if(/\bvmware\b|\bbroadcom\b|\bvcf\b|\bvsphere\b|\bvcp\b|\bvcap\b/.test(s)) return 'VMware / Broadcom';
    if(/\bnutanix\b|\bncp-/.test(s)) return 'Nutanix';
    if(/\bcrowdstrike\b|\bfalcon administrator\b|\bccfa\b/.test(s)) return 'CrowdStrike';
    if(/\bsplunk\b/.test(s)) return 'Splunk';
    if(/\boracle\b|\boci\b/.test(s)) return 'Oracle';
    if(/\bsalesforce\b/.test(s)) return 'Salesforce';
    if(/\bsnowflake\b/.test(s)) return 'Snowflake';
    if(/\bdatabricks\b/.test(s)) return 'Databricks';
    if(/\bcheck point\b|\bccsa\b|\bccse\b/.test(s)) return 'Check Point';
    if(/\bec-council\b|\bceh\b|\bchfi\b|\bcciso\b/.test(s)) return 'EC-Council';
    if(/\bproject management institute\b|\bpmi\b|\bpmp\b|\bcapm\b/.test(s)) return 'PMI';
    if(/\bservicenow\b/.test(s)) return 'ServiceNow';
    if(/\bibm\b/.test(s)) return 'IBM';
    if(/\bdell technologies\b|\bdell emc\b/.test(s)) return 'Dell Technologies';
    if(/\bnvidia\b/.test(s)) return 'NVIDIA';
    if(/\bf5\b|\bbig-ip\b/.test(s)) return 'F5';

    // Preserve a real vendor label instead of collapsing unknown legitimate
    // vendors into the catch-all "Other" bucket used by the legacy shell.
    if(raw&&!/^(other|unknown|vendor|certification|multi-vendor)$/i.test(raw)){
      if(/amazon web services/i.test(raw)) return 'AWS';
      if(/google/i.test(raw)&&/cloud/i.test(raw)) return 'Google Cloud';
      if(/linux foundation|cncf/i.test(raw)) return 'Linux Foundation / CNCF';
      if(/vmware|broadcom/i.test(raw)) return 'VMware / Broadcom';
      if(/peoplecert|itil/i.test(raw)) return 'PeopleCert / ITIL';
      if(/hpe|juniper|aruba/i.test(raw)) return 'HPE / Juniper Networking';
      return raw;
    }

    // Truly unlabeled records are uncommon in the verified seed. Keep them in
    // a named standards bucket rather than recreating the broken "Other" nav.
    return 'Independent / Multi-Vendor';
  }

  function normalizedCatalog(){
    var authoritative=Array.isArray(window.ITCV_META)?window.ITCV_META:null;
    if(!authoritative||authoritative.length!==EXPECTED_CERTIFICATION_COUNT) return null;
    return authoritative.map(function(cert){
      var copy=Object.assign({},cert);
      var vendor=vendorFromText(copy);
      copy.providerGroup=vendor;
      copy.vendor=vendor;
      copy.provider=vendor;
      return copy;
    });
  }

  function normalizeCatalog(){
    if(catalogNormalized) return;
    var list=normalizedCatalog();
    if(!list) return;

    var fallback=window.ITCV_FINAL_SHELL_V9_STATIC_META;
    if(Array.isArray(fallback)){
      fallback.splice(0,fallback.length);
      list.forEach(function(cert){fallback.push(Object.assign({},cert));});
    }

    window.CERT_META=list.map(function(cert){return Object.assign({},cert);});
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;
    catalogNormalized=true;
  }

  function vendorGroups(){
    var list=Array.isArray(window.CERT_META)?window.CERT_META:[];
    var groups=Object.create(null);
    list.forEach(function(cert){
      if(!cert||!cert.id) return;
      var vendor=vendorFromText(cert);
      (groups[vendor]||(groups[vendor]=[])).push(cert);
    });
    return Object.keys(groups).map(function(name){
      groups[name].sort(function(a,b){return clean(a.name||a.id).localeCompare(clean(b.name||b.id));});
      return {name:name,certs:groups[name]};
    }).sort(function(a,b){
      var ai=VENDOR_ORDER.indexOf(a.name),bi=VENDOR_ORDER.indexOf(b.name);
      if(ai<0) ai=999;
      if(bi<0) bi=999;
      if(ai!==bi) return ai-bi;
      return a.name.localeCompare(b.name);
    });
  }

  function certHtml(cert){
    var id=esc(cert.id);
    var name=esc(cert.name||cert.title||cert.id);
    var code=esc(clean(cert.code||cert.examCode||'CERT').split(' ')[0]);
    return '<div class="grp" data-grp="'+id+'">'
      +'<button class="grp-btn" type="button" data-v9-cert="'+id+'">'
      +'<span class="gcode">'+code+'</span><span>'+name+'</span>'
      +'<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>'
      +'</button><div class="grp-sub"><ul>'
      +'<li><a href="#/'+id+'">Overview</a></li>'
      +'<li><a href="#/'+id+'/book">Study Book</a></li>'
      +'<li><a href="#/'+id+'/labs">Performance Labs</a></li>'
      +'<li><a href="#/'+id+'/set-1">Practice Questions</a></li>'
      +'</ul></div></div>';
  }

  function providerHtml(group,active){
    var open=group.certs.some(function(cert){return String(cert.id)===String(active);});
    return '<section class="itcv-v9-provider'+(open?' open':'')+'" data-provider-name="'+esc(group.name)+'">'
      +'<button type="button" class="itcv-v9-provider-btn" data-v9-provider>'
      +'<span>'+esc(group.name)+'</span><span class="itcv-v9-count">'+group.certs.length+'</span>'
      +'<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>'
      +'</button><div class="itcv-v9-provider-certs">'+group.certs.map(certHtml).join('')+'</div></section>';
  }

  function renderCanonicalNav(){
    if(navRendering) return;
    normalizeCatalog();
    var nav=document.querySelector('[data-nav]');
    if(!nav||!Array.isArray(window.CERT_META)||window.CERT_META.length!==EXPECTED_CERTIFICATION_COUNT) return;

    var existingCount=nav.querySelectorAll('.grp[data-grp]').length;
    var hasOther=Array.prototype.some.call(nav.querySelectorAll('[data-provider-name]'),function(el){
      return clean(el.getAttribute('data-provider-name')).toLowerCase()==='other';
    });
    if(nav.dataset.itcvCanonicalNav==='ready'&&existingCount===EXPECTED_CERTIFICATION_COUNT&&!hasOther) return;

    navRendering=true;
    try{
      var active=(String(location.hash||'').match(/^#\/?([^/?]+)/)||[])[1]||'';
      var groups=vendorGroups();
      nav.innerHTML=groups.map(function(group){return providerHtml(group,active);}).join('');
      nav.dataset.itcvCanonicalNav='ready';
      nav.dataset.itcvCertCount=String(EXPECTED_CERTIFICATION_COUNT);
      nav.dataset.itcvVendorCount=String(groups.length);
      delete nav.dataset.itcvFinalV9;
      delete nav.dataset.itcvNavV7;

      window.CERT_PROVIDER_GROUPS=groups.map(function(group){
        return {name:group.name,ids:group.certs.map(function(cert){return cert.id;})};
      });

      var label=nav.previousElementSibling;
      if(label&&label.classList&&label.classList.contains('side-label')){
        label.textContent='CERTIFICATIONS · '+EXPECTED_CERTIFICATION_COUNT;
      }
    }finally{
      navRendering=false;
    }
  }

  function certificationContext(el){
    var node=el;
    for(var depth=0;depth<4&&node&&node!==document.body;depth++,node=node.parentElement){
      var text=clean(node.textContent);
      if(text.length<=220&&/certification/i.test(text)) return true;
    }
    return false;
  }

  function fixCertificationCount(){
    normalizeCatalog();
    renderCanonicalNav();
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;

    var nav=document.querySelector('[data-nav]');
    var groups=vendorGroups();
    if(nav){
      nav.dataset.itcvCertCount=String(EXPECTED_CERTIFICATION_COUNT);
      nav.dataset.itcvVendorCount=String(groups.length);
    }

    document.querySelectorAll('.side-label,h1,h2,h3,.phead,strong,span').forEach(function(el){
      if(!el) return;
      var text=clean(el.textContent);
      if(!text) return;

      if(/^CERTIFICATIONS\s*[·:]\s*\d+$/i.test(text)){
        el.textContent='CERTIFICATIONS · '+EXPECTED_CERTIFICATION_COUNT;
        return;
      }

      if(/\b\d+\s+IT certifications\b/i.test(text)&&text.length<=160){
        el.textContent=text.replace(/\b\d+\s+IT certifications\b/i,EXPECTED_CERTIFICATION_COUNT+' IT certifications');
        return;
      }

      if(el.parentElement&&/IT certification tracks/i.test(clean(el.parentElement.textContent))&&/^\d+$/.test(text)){
        el.textContent=String(EXPECTED_CERTIFICATION_COUNT);
        return;
      }

      if(el.parentElement&&/certification vendor families/i.test(clean(el.parentElement.textContent))&&/^\d+$/.test(text)){
        el.textContent=String(groups.length);
        return;
      }

      if(/^\d+$/.test(text)&&certificationContext(el)&&Number(text)>EXPECTED_CERTIFICATION_COUNT){
        el.textContent=String(EXPECTED_CERTIFICATION_COUNT);
      }
    });
  }

  function scan(root){
    if(!root) return;
    installStyles();
    fixCertificationCount();
    if(root.nodeType===1&&root.matches&&root.matches('button,a,[role="button"]')) markControl(root);
    if(root.querySelectorAll){
      root.querySelectorAll('button,a,[role="button"]').forEach(markControl);
    }
  }

  function run(){scan(document.body||document.documentElement);}

  installStyles();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();

  document.addEventListener('click',function(event){
    var provider=event.target.closest&&event.target.closest('[data-v9-provider]');
    if(provider){
      var section=provider.closest('.itcv-v9-provider');
      if(section) section.classList.toggle('open');
      return;
    }
    var certButton=event.target.closest&&event.target.closest('[data-v9-cert]');
    if(certButton){
      var row=certButton.closest('.grp');
      if(row) row.classList.toggle('open');
    }
  },true);

  var queued=false;
  new MutationObserver(function(records){
    if(navRendering||queued) return;
    var needsScan=records.some(function(record){
      return (record.addedNodes&&record.addedNodes.length)||record.type==='characterData';
    });
    if(!needsScan) return;
    queued=true;
    requestAnimationFrame(function(){queued=false;run();});
  }).observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  window.addEventListener('hashchange',function(){
    var nav=document.querySelector('[data-nav]');
    if(nav) delete nav.dataset.itcvCanonicalNav;
    renderCanonicalNav();
  });

  [100,350,900,1800,3500,5000].forEach(function(ms){setTimeout(function(){
    var nav=document.querySelector('[data-nav]');
    if(nav) delete nav.dataset.itcvCanonicalNav;
    fixCertificationCount();
  },ms);});
})();
