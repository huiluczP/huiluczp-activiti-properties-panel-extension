import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {
  // 返回delegateExpression输入框设置
  return [
    {
      id: 'delegateExpression',
      element,
      // 设置事件
      component: delegateExpression,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

// 属性的增加
function delegateExpression(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  
  // 返回的信息，用来获取对应值生成xml
  const getValue = () => {
    return element.businessObject.delegateExpression || '';
  }

  // 设置xml写入的信息
  const setValue = value => {
    return modeling.updateProperties(element, {
      delegateExpression: value
    });
  }

  return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('set delegate expression') }
    label=${ translate('设置自动任务task') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />`
}
