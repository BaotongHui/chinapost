import Vue from 'vue'

export function testAction(action, args, state, actions, expectedMutations, done) {
    let count = 0
    const commit = (type, payload) => {
        const mutation = expectedMutations[count]
        expect(mutation.type).to.equal(type)
        if (payload) {
            expect(JSON.stringify(mutation.payload)).to.equal(JSON.stringify(payload))
        }
        count++
        if (count >= expectedMutations.length) {
            done()
        }
    }

    const dispatch = (actionName, param) => {
        actions[actionName]({ commit }, param)
    }

    action({ commit, state, dispatch }, ...args)

    if (expectedMutations.length === 0) {
        expect(count).to.equal(0)
        done()
    }
}

export function renderedText(component, propsData) {
    const Ctor = Vue.extend(component)
    const vm = new Ctor({ propsData }).$mount()
    return vm.$el.textContent
}

export function createVM(component, propsData) {
    const Ctor = Vue.extend(component)
    const el = createEl()
    const vm = new Ctor({ propsData }).$mount(el)
    return vm
}

export function destoryVM(vm) {
    vm.$el && vm.$el.parentNode && vm.$el.parentNode.removeChild(vm.$el)
}

export function triggerEvent(el, name, ...options) {
    let evtName
    if (/^mouse|click/.test(name)) {
        evtName = 'MouseEvents'
    } else if (/^key/.test(name)) {
        evtName = 'KeyboardEvent'
    } else {
        evtName = 'HTMLEvents'
    }
    let evt = document.createEvent(evtName)
    evt.initEvent(name, ...options)

    el.dispatchEvent ? el.dispatchEvent(evt) : el.fireEvent(`on${name}`, evt)
    return el
}

export function triggerClick(el, ...options) {
    triggerEvent(el, 'mousedown', ...options)
    triggerEvent(el, 'mouseup', ...options)
    return el
}