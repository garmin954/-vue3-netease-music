import Vue, {defineComponent, reactive, nextTick, onMounted, getCurrentInstance} from 'vue';
import {ElDialog, ElButton} from 'element-plus';

let instance: any;

const setup = (props: any) => {
  const {visible, text, title, onConfirm} = props;
  const state = reactive({
    // visible: false,
  });

  instance = getCurrentInstance();
  onMounted(() => {
    // console.log('sd');
  });
  const confirmAndClose = () => {
    // props.visible.value = false;
    onConfirm();
    // visible.value = false;
  };

  // console.log(visible);
  return () => (
    <div>
      <el-dialog
        modal={true}
        modelValue={visible}
        // width={$utils.toRem(320)}
        customClass='confirm-dialog'
      >
        {{
          title: () => <div>{title || '提示'}</div>,
          default: () => (
            <div class='confirm-body'>{text}</div>
          ),
          footer: () => (
            <span class='dialog-footer'>
                <el-button onClick={confirmAndClose}
                           class='confirm-btn'
                           type='primary'
                >确认</el-button>
            </span>
          ),
        }}
      </el-dialog>
    </div>

  );
};

const confirmCore = (props: any = '') => {
  return {
    name: 'Confirm',
    components: {
      ElDialog,
      ElButton,
    },
    props: props ? props : {
      visible: {
        default: false,
        type: Boolean,
      },
      text: {
        default: '提示内容',
        type: String,
      },
      title: {
        default: '提示',
        type: String,
      },
      onConfirm: {
        default: () => {},
        type: Function,
      },
    },
    setup,
  };
};
const OriginalConfirm = defineComponent(confirmCore());

export default OriginalConfirm;

const Confirm = {
  extends: OriginalConfirm,
};


export const confirm = function(text: string, title: string | undefined, onConfirm: any = () => {}) {
    // if (typeof title === 'function') {
    //   onConfirm = title;
    //   title = undefined;
    // }

    // console.log(instance);
  //   instance.props.visible = true;
  // instance.update()
  //   instance.props = {
  //     text,
  //     title,
  //     onConfirm,
  //     visible: true
  //   };
  // instance.props.visible = true;
  // console.log(instance.props.get('visible'));
  // // const instance = defineComponent(confirmCore({text, title, onConfirm}));
    nextTick(() => {
      // console.log(instance);
      instance.props.visible = true;
    });
  // confirmCore()
};
// // 单例减少开销
// let instanceCache:any
// // 命令式调用
// export const confirm = function(text:string, title:string | undefined, onConfirm:any = () => {}) {
//   if (typeof title === "function") {
//     onConfirm = title
//     title = undefined
//   }
//
//   const ConfirmCtor = defineComponent({
//     extends: OriginalConfirm,
//   })
//   const getInstance = () => {
//     if (!instanceCache) {
//       instanceCache = new ConfirmCtor({
//         propsData: {
//           text,
//           title,
//           onConfirm
//         }
//       })
//       // 生成dom
//       instanceCache.$mount()
//       document.body.appendChild(instanceCache.$el)
//     } else {
//       // 更新属性
//       instanceCache.text = text
//       instanceCache.title = title
//       instanceCache.onConfirm = onConfirm
//     }
//     return instanceCache
//   }
//   const instance = getInstance()
//   // 确保更新的prop渲染到dom
//   // 确保动画效果
//   Vue.nextTick(() => {
//     instance.visible = true
//   })
// }
// const
// <style lang="scss" scoped>
//   .confirm-dialog {
//   /deep/.el-dialog__body {
//   padding-top: 20px;
//   padding-bottom: 20px;
// }
//   .confirm-body
//   line-height: 20px;
// }
//   .confirm-btn {
//   width: 100%;
// }
// }
// </style>
