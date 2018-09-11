UE.commands['phonepreview'] = {
    execCommand : function(){
        var w = window.open('', '_blank', ''),
            d = w.document;
        console.log(d);
        d.open();
        d.write('<!DOCTYPE html><html><head><meta charset="utf-8"/><script src="'+this.options.UEDITOR_HOME_URL+'ueditor.parse.js"></script><script>' +
            "setTimeout(function(){uParse('div',{rootPath: '"+ this.options.UEDITOR_HOME_URL +"'})},300)" +
            '</script></head><body><div>'+this.getContent(null,null,true)+'</div></body></html>');
        d.close();
    },
    notNeedUndo : 1
};