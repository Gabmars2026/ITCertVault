(function(){
  'use strict';

  var STYLE_ID='itcv-visual-layout-fix';
  var EXPECTED_CERTIFICATION_COUNT=332;
  var COMPTIA_ORDER=[
    'aplus','networkplus','securityplus','cysaplus','pentestplus','securityx',
    'linuxplus','serverplus','cloudplus','cloudnetx','dataplus','datasysplus',
    'projectplus','secai','dataai','autoops'
  ];

  function clean(value){
    return String(value==null?'':value).replace(/\s+/g,' ').trim();
  }

  function comptiaRank(id){
    var index=COMPTIA_ORDER.indexOf(String(id||''));
    return index<0?999:index;
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
    if(/\bjuniper\b|\bjunos\b|\bjncia\b|\bjncis\b|\bjncip\b|\bjncie\b|\bhpe\b|\bhewlett packard enterprise\b|\baruba\b/.test(s)) return 'HPE / Juniper Networking';
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

    if(raw&&!/^(other|unknown|vendor|certification|multi-vendor)$/i.test(raw)){
      if(/amazon web services/i.test(raw)) return 'AWS';
      if(/google/i.test(raw)&&/cloud/i.test(raw)) return 'Google Cloud';
      if(/linux foundation|cncf/i.test(raw)) return 'Linux Foundation / CNCF';
      if(/vmware|broadcom/i.test(raw)) return 'VMware / Broadcom';
      if(/peoplecert|itil/i.test(raw)) return 'PeopleCert / ITIL';
      if(/hpe|juniper|aruba/i.test(raw)) return 'HPE / Juniper Networking';
      return raw;
    }

    return 'Independent / Multi-Vendor';
  }

  function orderCompTIARecords(list){
    if(!Array.isArray(list)) return;
    var positions=[];
    var certs=[];
    list.forEach(function(cert,index){
      if(cert&&vendorFromText(cert)==='CompTIA'){
        positions.push(index);
        certs.push(cert);
      }
    });
    var original=certs.slice();
    certs.sort(function(a,b){
      var diff=comptiaRank(a&&a.id)-comptiaRank(b&&b.id);
      return diff||original.indexOf(a)-original.indexOf(b);
    });
    positions.forEach(function(position,index){list[position]=certs[index];});
  }

  function normalizeMetadata(){
    var authoritative=Array.isArray(window.ITCV_META)?window.ITCV_META:null;
    if(!authoritative||authoritative.length!==EXPECTED_CERTIFICATION_COUNT) return false;

    authoritative.forEach(function(cert){
      if(!cert) return;
      var vendor=vendorFromText(cert);
      cert.providerGroup=vendor;
      cert.vendor=vendor;
      cert.provider=vendor;
    });
    orderCompTIARecords(authoritative);

    window.CERT_META=authoritative.map(function(cert){return Object.assign({},cert);});
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;

    var shell=window.ITCV_FINAL_SHELL_V9_STATIC_META;
    if(Array.isArray(shell)){
      shell.splice(0,shell.length);
      window.CERT_META.forEach(function(cert){shell.push(Object.assign({},cert));});
    }
    var snap=window.ITCV_CERT_NAV_V7_SNAPSHOT;
    if(snap&&Array.isArray(snap.meta)){
      snap.meta.splice(0,snap.meta.length);
      window.CERT_META.forEach(function(cert){snap.meta.push(Object.assign({},cert));});
    }

    return true;
  }

  normalizeMetadata();

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

  function organizeCompTIANav(){
    var nav=document.querySelector('[data-nav]');
    if(!nav) return;
    var section=null;
    nav.querySelectorAll('section[data-provider-name]').forEach(function(candidate){
      if(!section&&clean(candidate.getAttribute('data-provider-name')).toLowerCase()==='comptia') section=candidate;
    });
    if(!section) return;

    var host=section.querySelector('.itcv-v7-provider-certs,.itcv-v9-provider-certs');
    if(!host) return;
    var rows=Array.from(host.querySelectorAll(':scope > .grp[data-grp]'));
    if(rows.length<2) rows=Array.from(host.querySelectorAll('.grp[data-grp]'));
    if(rows.length<2) return;

    var original=rows.slice();
    var desired=rows.slice().sort(function(a,b){
      var diff=comptiaRank(a.getAttribute('data-grp'))-comptiaRank(b.getAttribute('data-grp'));
      return diff||original.indexOf(a)-original.indexOf(b);
    });
    var changed=desired.some(function(row,index){return row!==rows[index];});
    if(changed) desired.forEach(function(row){host.appendChild(row);});
  }

  function fixCounters(){
    window.CERT_CATALOG_COUNT=EXPECTED_CERTIFICATION_COUNT;
    window.CERT_CERTIFICATION_COUNT=EXPECTED_CERTIFICATION_COUNT;
    document.querySelectorAll('.side-label,h1,h2,h3,.phead,strong,span').forEach(function(el){
      if(!el) return;
      var text=clean(el.textContent);
      if(/^CERTIFICATIONS\s*[·:]\s*\d+$/i.test(text)){
        el.textContent='CERTIFICATIONS · '+EXPECTED_CERTIFICATION_COUNT;
      }else if(/\b\d+\s+IT certifications\b/i.test(text)&&text.length<=160){
        el.textContent=text.replace(/\b\d+\s+IT certifications\b/i,EXPECTED_CERTIFICATION_COUNT+' IT certifications');
      }
    });
  }

  function scan(root){
    if(!root) return;
    installStyles();
    fixCounters();
    organizeCompTIANav();
    if(root.nodeType===1&&root.matches&&root.matches('button,a,[role="button"]')) markControl(root);
    if(root.querySelectorAll) root.querySelectorAll('button,a,[role="button"]').forEach(markControl);
  }

  function run(){scan(document.body||document.documentElement);}

  installStyles();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();

  var queued=false;
  new MutationObserver(function(records){
    if(queued) return;
    var needs=records.some(function(r){return r.addedNodes&&r.addedNodes.length;});
    if(!needs) return;
    queued=true;
    requestAnimationFrame(function(){queued=false;run();});
  }).observe(document.documentElement,{childList:true,subtree:true});

  [100,350,900,1800,3500].forEach(function(ms){setTimeout(function(){fixCounters();organizeCompTIANav();},ms);});
})();