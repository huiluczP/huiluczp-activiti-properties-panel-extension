
import DelegateExpression from './parts/DelegateExpression';
import ExecutionListener from './parts/ExecutionListener';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import ExtensionExecutionListenerGroup from './parts/ExtensionExecutionListenerGroup';

import { ListGroup } from '@bpmn-io/properties-panel';

const LOW_PRIORITY = 500;

// 主方法，对右侧栏进行扩展
export default function ActivitiPropertiesProvider(propertiesPanel, injector, translate) {

  // 组中增加对应的项目
  this.getGroups = function(element) {
    return function(groups) {
      
      // 自动节点，增加自动任务的task表达式设置
      if(is(element, 'bpmn:ServiceTask')){
        groups.push(createDelegateExpression(element, translate));
      }

      // 网关增加listener属性
      if(is(element, 'bpmn:ExclusiveGateway')){
        groups.push(createExecutionListener(element, translate));
      }

      // 网关增加extensionElement：ExecutionListener
      if(is(element, 'bpmn:ExclusiveGateway')){
        groups.push(createExtensionExclusiveGateway(element, injector, translate));
      }

      return groups;
    }
  };

  // 放到最下方
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ActivitiPropertiesProvider.$inject = [ 'propertiesPanel', 'injector', 'translate' ];

// 构建右侧面板中的delegate expression
function createDelegateExpression(element, translate) {
  const delegateExpressionGroup = {
    id: 'DelegateExpression',
    label: translate('对应实现类表达式设置'),
    entries: DelegateExpression(element)
  };
  return delegateExpressionGroup
}

// 构建右侧面板中的execution listener
function createExecutionListener(element, translate){
  const executionListenerGroup = {
    id: 'ExecutionListener',
    label: translate('execution listener'),
    entries: ExecutionListener(element)    
  };
  return executionListenerGroup;
}

// 构建extensionElement下的exectionListener
function createExtensionExclusiveGateway(element, injector, translate){
  // 构建group list
  const elGroup = {
    id: 'ExtensionExectionListener',
    label: translate('对应监听实现类设置'),
    component: ListGroup,
    ...ExtensionExecutionListenerGroup({ element, injector })
  };

  return elGroup; 
}