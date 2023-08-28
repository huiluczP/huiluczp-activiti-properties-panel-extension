import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'assignee',
      element,
      // 设置事件
      component: assignee,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

// 属性的增加
function assignee(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  
  // 返回的信息，用来获取对应值生成xml
  const getValue = () => {
    return element.businessObject.assignee || '';
  }

  // 设置xml写入的信息
  const setValue = value => {
    return modeling.updateProperties(element, {
      Assignee: value
    });
  }

  return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('set an assignee') }
    label=${ translate('Assignee') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />`
}
