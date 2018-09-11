/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：公共UEditor组件
*/
<template>
  <div class="UEditor">
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  import '../../../static/js/lib/ueditor/ueditor.config.js'
  import '../../../static/js/lib/ueditor/ueditor.all.js'
  import '../../../static/js/lib/ueditor/lang/zh-cn/zh-cn.js'

  export default {
    name: 'UEditor',
    props: ['options', 'disabled'],
    data() {
      return {
        editorVal: this.$props.options,
        isDisable: this.$props.disabled,
        editor: null,
        ueditorOptions:{
          containerStyle:{},
          config:{
            serverUrl:''
          }
        }
      }
    },
    mounted () {
      //初始化UE
      let vm = this;
      UE.delEditor('editor');
      vm.editor = UE.getEditor('editor');
      vm.editor.addListener('ready', function () {
        vm.editor.setHeight(300);
        vm.setContents(vm.editorVal);
        vm.isSetDisable(vm.isDisable);
      });
      vm.editor.addListener('blur', function () {
        vm.editorVal = vm.editor.getContent();
      });
    },
    watch: {
      options: {
        handler (newValue, oldValue) {
          let vm = this;
          vm.editorVal = newValue;
          vm.setContents(vm.editorVal);
        }
      },
      disabled: {
        handler (newValue, oldValue) {
          let vm = this;
          vm.isDisable = newValue;
          vm.isSetDisable(vm.isDisable);
        }
      }
    },
    destoryed () {
      this.editor.destory();
    },
    methods:{
      isSetDisable (isDisable) {
        let vm = this;
        if (isDisable) {
          vm.editor.setDisabled(['preview', 'phonepreview']);
        }else {
          vm.editor.setEnabled();
        }
      },
      getInstance () {
        return this.editor.getContent();
      },
      setContents (val) {
        let vm = this;
        vm.editor.setContent(val);
      },
      reset () {
        let vm = this;
        vm.editor.setContent('')
      }
    }
  }
</script>
<style lang="less" scoped>
  .UEditor{
    line-height: 0;
  }
</style>
