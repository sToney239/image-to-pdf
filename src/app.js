'use strict';

const translations = {
  zh: {
    title:'图片转 PDF', tag:'一个文件 · 离线使用', intro:'放入一张图片，保存为 PDF。新图片会替换当前图片。',
    language:'界面语言', auto:'自动', tool:'图片转换工具', zone:'点击选择 JPG 或 PNG 图片，也可拖入或粘贴图片',
    prompt:'拖入图片，或点击这里选择', formats:'支持 JPG / PNG', pasteBefore:'也可以在此页面按', pasteAfter:'粘贴截图或图片',
    preview:'当前待转换图片', replace:'点击或拖入新图片以替换 · 也可粘贴图片', save:'保存 PDF', clear:'清空',
    privacy:'图片只在当前浏览器处理，不上传。', transparency:'PNG 的透明背景会转换为白色。', footer:'PDF 页面按图片比例生成。',
    empty:'尚未选择图片', initial:'准备好图片后，点击下方按钮保存。', reading:'正在读取图片…', generating:'正在生成 PDF…',
    ready:'PDF 已准备好，可以保存。', multi:'一次只处理一张，已使用第一张支持的图片。', downloaded:'已发起 PDF 下载，请查看浏览器下载列表或保存对话框。',
    unsupported:'请选择 JPG 或 PNG 图片。', noImage:'没有找到 JPG 或 PNG 图片。', kept:'当前图片已保留。',
    noClipboard:'剪贴板里没有可读取的图片。请先截图，或复制图片本身，再回到页面粘贴。',
    failed:'转换失败：{reason}', invalid:'无法读取图片，请检查文件是否完整。', emptySize:'图片没有有效的尺寸。',
    tooLarge:'图片超过 5000 万像素，请缩小后重试。', noCanvas:'浏览器无法创建图片画布。', generic:'请换一张图片重试。',
    pasted:'粘贴图片', fallback:'图片', pixels:'{width} × {height} 像素'
  },
  ja: {
    title:'画像を PDF に変換', tag:'単一ファイル · オフライン対応', intro:'画像を1枚入れて PDF として保存。新しい画像を入れると、現在の画像が置き換わります。',
    language:'表示言語', auto:'自動', tool:'画像変換ツール', zone:'クリックして JPG または PNG を選択、または画像をドロップ・貼り付け',
    prompt:'画像をドロップ、またはクリックして選択', formats:'JPG / PNG に対応', pasteBefore:'このページで', pasteAfter:'を押してスクリーンショットや画像を貼り付け',
    preview:'変換する画像のプレビュー', replace:'クリック・ドロップ・貼り付けで画像を置き換え', save:'PDF を保存', clear:'クリア',
    privacy:'画像はブラウザー内で処理され、アップロードされません。', transparency:'PNG の透明な背景は白に変換されます。', footer:'PDF のページは画像の縦横比に合わせます。',
    empty:'画像が選択されていません', initial:'画像を入れたら、下のボタンで保存してください。', reading:'画像を読み込み中…', generating:'PDF を作成中…',
    ready:'PDF の準備ができました。保存できます。', multi:'一度に処理できるのは1枚です。対応する最初の画像を使用しました。', downloaded:'PDF のダウンロードを開始しました。ダウンロード一覧または保存ダイアログをご確認ください。',
    unsupported:'JPG または PNG 画像を選択してください。', noImage:'JPG または PNG 画像が見つかりません。', kept:'現在の画像は保持されています。',
    noClipboard:'クリップボードに読み取れる画像がありません。スクリーンショットを撮るか、画像そのものをコピーしてから貼り付けてください。',
    failed:'変換できませんでした：{reason}', invalid:'画像を読み取れません。ファイルが破損していないかご確認ください。', emptySize:'画像のサイズが無効です。',
    tooLarge:'画像が5,000万画素を超えています。縮小してから再試行してください。', noCanvas:'ブラウザーで画像の処理領域を作成できません。', generic:'別の画像で再試行してください。',
    pasted:'貼り付けた画像', fallback:'画像', pixels:'{width} × {height} ピクセル'
  },
  en: {
    title:'Image to PDF', tag:'ONE FILE · WORKS OFFLINE', intro:'Add one image and save it as a PDF. A new image replaces the current one.',
    language:'Interface language', auto:'Auto', tool:'Image converter', zone:'Choose a JPG or PNG image, or drop or paste an image',
    prompt:'Drop an image, or click to choose', formats:'Supports JPG / PNG', pasteBefore:'You can also press', pasteAfter:'on this page to paste a screenshot or image',
    preview:'Preview of the current image', replace:'Click, drop or paste a new image to replace this one', save:'Save PDF', clear:'Clear',
    privacy:'Images stay in your browser and are never uploaded.', transparency:'Transparent PNG backgrounds become white.', footer:'The PDF page follows the image proportions.',
    empty:'No image selected', initial:'Add an image, then use the button below to save it.', reading:'Reading image…', generating:'Creating PDF…',
    ready:'Your PDF is ready to save.', multi:'Only one image is processed at a time. The first supported image was used.', downloaded:'PDF download started. Check your browser downloads or save dialog.',
    unsupported:'Please choose a JPG or PNG image.', noImage:'No JPG or PNG image was found.', kept:'Your current image has been kept.',
    noClipboard:'No readable image was found in the clipboard. Take a screenshot or copy the image itself, then paste it on this page.',
    failed:'Conversion failed: {reason}', invalid:'The image could not be read. Check that the file is not damaged.', emptySize:'The image has no valid dimensions.',
    tooLarge:'This image exceeds 50 megapixels. Resize it and try again.', noCanvas:'Your browser could not create an image canvas.', generic:'Please try another image.',
    pasted:'Pasted image', fallback:'Image', pixels:'{width} × {height} pixels'
  }
};

const zone=document.getElementById('zone'), input=document.getElementById('file'), preview=document.getElementById('preview');
const info=document.getElementById('info'), status=document.getElementById('status'), save=document.getElementById('save'), clear=document.getElementById('clear'), languageSelect=document.getElementById('language');
let generation=0, current=null, previewUrl=null, dragDepth=0, infoState=null;
let statusState={key:'initial', error:false, kept:false, multi:false, reason:null};
let language='en';
const storageKey='image-to-pdf-language';
function browserLanguage(){const primary=(navigator.language||navigator.languages?.[0]||'en').toLowerCase().split(/[-_]/)[0];return primary==='zh'?'zh':primary==='ja'?'ja':'en'}
function t(key,params={}){return (translations[language][key]||translations.en[key]||key).replace(/\{(\w+)\}/g,(_,name)=>params[name]??'')}
function renderInfo(){info.textContent=infoState?(infoState.name||t('pasted'))+(infoState.width?' · '+t('pixels',infoState):''):t('empty')}
function renderStatus(){let text=t(statusState.key,{reason:statusState.reason?t(statusState.reason):''});if(statusState.multi)text=t('multi')+' '+text;if(statusState.kept)text+=' '+t('kept');status.textContent=text;status.classList.toggle('error',statusState.error)}
function message(key,options={}){statusState={key,error:false,kept:false,multi:false,reason:null,...options};renderStatus()}
function applyLanguage(){
  language=languageSelect.value==='auto'?browserLanguage():languageSelect.value;
  document.documentElement.lang=language==='zh'?'zh-CN':language;
  document.title=t('title');
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
  preview.alt=t('preview');renderInfo();renderStatus();
}
try{const stored=localStorage.getItem(storageKey);if(['auto','zh','ja','en'].includes(stored))languageSelect.value=stored}catch{}
languageSelect.addEventListener('change',()=>{try{localStorage.setItem(storageKey,languageSelect.value)}catch{}applyLanguage()});
applyLanguage();
if(/Mac|iPhone|iPad/.test(navigator.platform))document.getElementById('pasteKey').textContent='⌘';

function reset(){generation++;current=null;infoState=null;save.disabled=true;clear.disabled=true;zone.classList.remove('loaded');preview.removeAttribute('src');if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}input.value='';renderInfo();message('initial')}
function isSupported(file){return !!file&&(['image/jpeg','image/png'].includes(file.type)||(!file.type&&/\.(jpe?g|png)$/i.test(file.name)))}
function pdfName(name){const stem=(name||t('pasted')).replace(/\.[^.]+$/,'').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/[. ]+$/,'')||t('fallback');return stem+'.pdf'}
async function loadFile(file,multiple=false){
  if(!isSupported(file)){message('unsupported',{error:true,kept:!!current});return}
  const token=++generation;current=null;save.disabled=true;clear.disabled=false;zone.classList.remove('loaded');preview.removeAttribute('src');
  if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}
  infoState={name:file.name};renderInfo();message('reading');
  const url=URL.createObjectURL(file);
  let failureReason='invalid';
  try{
    const img=new Image();img.src=url;await img.decode();if(token!==generation)return;
    const width=img.naturalWidth,height=img.naturalHeight;
    if(!width||!height)throw new Error('emptySize');
    if(width*height>50000000)throw new Error('tooLarge');
    failureReason='generic';
    message('generating');await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));if(token!==generation)return;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('noCanvas');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.drawImage(img,0,0);
    // Lossless PNG embedding avoids an additional JPEG compression pass.
    const scale=Math.min(0.75,14400/Math.max(width,height)),pw=width*scale,ph=height*scale;
    const pdf=new window.jspdf.jsPDF({orientation:pw>ph?'landscape':'portrait',unit:'pt',format:[pw,ph],compress:true});
    pdf.addImage(canvas,'PNG',0,0,pw,ph,undefined,'FAST');
    pdf.setProperties({title:pdfName(file.name).replace(/\.pdf$/,''),creator:'Image to PDF'});
    const blob=pdf.output('blob');canvas.width=0;canvas.height=0;
    if(token!==generation)return;
    current={blob,fileName:file.name};previewUrl=url;preview.src=url;zone.classList.add('loaded');save.disabled=false;
    infoState={name:file.name,width,height};renderInfo();message('ready',{multi:multiple});
  }catch(error){if(token===generation){const reason=['emptySize','tooLarge','noCanvas'].includes(error.message)?error.message:failureReason;message('failed',{error:true,reason})}}
  finally{if(previewUrl!==url)URL.revokeObjectURL(url)}
}
function acceptFiles(files){const list=Array.from(files||[]),file=list.find(isSupported);if(!file){message('noImage',{error:true,kept:!!current});return}loadFile(file,list.length>1)}
zone.addEventListener('click',()=>input.click());
zone.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();input.click()}});
input.addEventListener('change',()=>{if(input.files.length)acceptFiles(input.files);input.value=''});
document.addEventListener('dragover',event=>event.preventDefault());
document.addEventListener('drop',event=>{event.preventDefault();dragDepth=0;zone.classList.remove('drag');if(zone.contains(event.target))acceptFiles(event.dataTransfer.files)});
zone.addEventListener('dragenter',event=>{event.preventDefault();dragDepth++;zone.classList.add('drag')});
zone.addEventListener('dragleave',()=>{dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)zone.classList.remove('drag')});
document.addEventListener('paste',event=>{
  const data=event.clipboardData;if(!data)return;
  const files=Array.from(data.files||[]);
  for(const item of Array.from(data.items||[])){if(item.kind==='file'&&isSupported({type:item.type})){const file=item.getAsFile();if(file&&!files.length)files.push(file)}}
  event.preventDefault();
  if(files.some(isSupported))acceptFiles(files);else message('noClipboard',{error:true,kept:!!current});
});
clear.addEventListener('click',()=>{reset();zone.focus()});
save.addEventListener('click',()=>{
  if(!current)return;
  const url=URL.createObjectURL(current.blob),link=document.createElement('a');
  link.href=url;link.download=pdfName(current.fileName);document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);message('downloaded');
});
zone.focus({preventScroll:true});
