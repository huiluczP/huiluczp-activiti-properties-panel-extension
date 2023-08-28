import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {
  // 返回executionListener输入框设置
  return [
    {
      id: 'executionListener',
      element,
      // 设置事件
      component: executionListener,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

// 属性的增加
function executionListener(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  
  // 返回的信息，用来获取对应值生成xml
  // 同时会实时读取xml中的数据反映到前端上
  const getValue = () => {
    return element.businessObject.executionListener || '';
  }

  // 设置xml写入的信息
  const setValue = value => {
    console.log(modeling);
    modeling.updateProperties(element, {
      executionListener: value
    });
  }

  return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('set execution Listener') }
    label=${ translate('设置网关listener判断') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />`
}
