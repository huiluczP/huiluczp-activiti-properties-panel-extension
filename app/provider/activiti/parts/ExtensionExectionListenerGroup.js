import {
    getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { without } from 'min-dash';
import ExtensionExectionListener from './ExtensionExectionListener';

import Ids from 'ids';

function nextId(prefix) {
    const ids = new Ids([32, 32, 1]);
    return ids.nextPrefixed(prefix);
}

function createElement(elementType, properties, parent, factory) {
    const element = factory.create(elementType, properties);

    if (parent) {
        element.$parent = parent;
    }

    return element;
}

// 关键方法，构建listener list
export default function ExtensionExectionListenerGroup({ element, injector }) {

    // 防空
    const exectionListeners = getExtensionExectionListenersAll(element) || [];
    console.log(exectionListeners);

    const bpmnFactory = injector.get('bpmnFactory'),
        commandStack = injector.get('commandStack');

    // 对list中的每个item进行构建
    const items = exectionListeners.map((parameter, index) => {
        // 按顺序给个id
        const id = element.id + '-exectionListener-' + index;
        // 构建item
        return {
            id,
            label: parameter.get('event') + '---' + parameter.get('delegateExpression') || '',
            entries: ExtensionExectionListener({
                idPrefix: id,
                element,
                parameter
            }),
            autoFocusEntry: id + '-el',
            remove: removeFactory({ commandStack, element, parameter })
        };
    });

    return {
        items,
        add: addFactory({ element, bpmnFactory, commandStack })
    };
}

// 去除item时执行的方法，先获取extensionElement，之后进行without处理，最后更新
function removeFactory({ commandStack, element, parameter }) {
    return function (event) {
        event.stopPropagation();

        const exectionListener = getExtensionExectionListeners(element);
    
        if (!exectionListener) {
            return;
        }

        // 利用without将当前item对应的信息剔除
        const parameters = without(exectionListener.get('values'), parameter);
        // 更新剔除后的信息
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: exectionListener,
            properties: {
                values: parameters
            }
        });
        
    };
}

// 增加item时执行的方法
function addFactory({ element, bpmnFactory, commandStack }) {
    return function (event) {
        event.stopPropagation();

        // 存放处理命令，最后使用commandStack执行
        const commands = [];

        const businessObject = getBusinessObject(element);

        let extensionElements = businessObject.get('extensionElements');

        // extensionElements是bpmn自带的属性，不存在则先创建
        if (!extensionElements) {
            extensionElements = createElement(
                'bpmn:ExtensionElements',
                { values: [] },
                businessObject,
                bpmnFactory
            );

            commands.push({
                cmd: 'element.updateModdleProperties',
                context: {
                    element,
                    moddleElement: businessObject,
                    properties: { extensionElements }
                }
            });
        }

        // 构建exectionListener
        const newExectionListener = createElement('activiti:exectionListener', {
            name: nextId('ExectionListener_'),
            event: 'start', // 这边其实可以改成下拉框
            delegateExpression: ''
        }, extensionElements, bpmnFactory);

        // 增加至extensionElements
        commands.push({
            cmd: 'element.updateModdleProperties',
            context: {
                element,
                moddleElement: extensionElements,
                properties: {
                    // 使新增的显示在下面
                    values: [newExectionListener, ...extensionElements.get('values')]
                }
            }
        });

        commandStack.execute('properties-panel.multi-command-executor', commands);
    };
}

// 获取element的extensionElment下的所有ExectionListener
function getExtensionExectionListeners(element) {
    const businessObject = getBusinessObject(element);
    // 不存在就算了
    if (!businessObject.extensionElements) {
        return null;
    }
    // 存在则使用filter找出所有的activiti:exectionListener
    return businessObject.extensionElements.values.filter(function (e) {
        return e.$instanceOf("activiti:exectionListener");
    });
}

// 获取element的extensionElment下的所有ExectionListener的所有信息
function getExtensionExectionListenersAll(element) {
    const values = getExtensionExectionListeners(element);
    return values;
}