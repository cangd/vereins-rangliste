import type Player from '@/models/Player'
import { TeamEnum } from '@/models/TeamEnum'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vitest } from 'vitest'
import AddPlayerVue from './AddPlayer.vue'
import TeamSelector from './TeamSelector.vue'

function setupComponent() {
  const cut = mount(AddPlayerVue)
  const teamSelector = () => cut.findComponent(TeamSelector).find('select')
  const nameInput = () => cut.find('#name')
  const singlesInput = () => cut.find('#singles')
  const doublesInput = () => cut.find('#doubles')
  const addButton = () => cut.find('#button')

  return {
    cut,
    nameInput,
    singlesInput,
    doublesInput,
    teamSelector,
    addButton
  }
}

const testPlayer: Player = {
  id: 1,
  name: 'Test Player',
  singles: '100',
  doubles: '100',
  team: TeamEnum.E
}

describe('AddPlayer.vue', () => {
  it('add button is initially not rendered', () => {
    const { addButton } = setupComponent()

    expect(addButton().exists()).toBe(false)
  })

  it('add button is rendered when input fields are set', async () => {
    const { nameInput, singlesInput, doublesInput, addButton } = setupComponent()

    await nameInput().setValue('Test Player')
    await singlesInput().setValue(100)
    await doublesInput().setValue(200)

    expect(addButton().exists()).toBe(true)
  })
  it('button includes name, ratings and team', async () => {
    const { nameInput, singlesInput, doublesInput, addButton, teamSelector } = setupComponent()

    await nameInput().setValue('Test Player')
    await singlesInput().setValue(100)
    await doublesInput().setValue(200)
    await teamSelector().setValue(TeamEnum.M4)

    expect(addButton().text()).toEqual('Add Test Player(100/200) [M4]')
  })

  it('creates last player Id from LocalStorage', async () => {
    const { nameInput, singlesInput, doublesInput, addButton } = setupComponent()
    vitest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('20')
    vitest.spyOn(Storage.prototype, 'setItem')
    await nameInput().setValue(testPlayer.name)
    await singlesInput().setValue(testPlayer.singles)
    await doublesInput().setValue(testPlayer.doubles)

    await addButton().trigger('click')

    expect(localStorage.getItem).toHaveBeenCalledWith('lastId')
    expect(localStorage.setItem).toHaveBeenCalledWith('lastId', '21')
  })

  it('adds player to session storage', async () => {
    const { nameInput, singlesInput, doublesInput, addButton } = setupComponent()
    vitest.spyOn(Storage.prototype, 'setItem')
    await nameInput().setValue(testPlayer.name)
    await singlesInput().setValue(testPlayer.singles)
    await doublesInput().setValue(testPlayer.doubles)

    await addButton().trigger('click')

    expect(sessionStorage.setItem).toHaveBeenCalled()
  })

  it('clears form after click', async () => {
    const { nameInput, singlesInput, doublesInput, addButton, teamSelector } = setupComponent()
    await nameInput().setValue('Test Player')
    await singlesInput().setValue(100)
    await doublesInput().setValue(200)
    await teamSelector().setValue(TeamEnum.M1)

    await addButton().trigger('click')

    expect(nameInput().text()).toBe('')
    expect(singlesInput().text()).toBe('')
    expect(doublesInput().text()).toBe('')
    expect(teamSelector().element.value).toEqual('Ersatz')
  })
})
