/**
 * @jest-environment jsdom
 */

 //import { screen, waitFor } from '@testing-library/dom'
 import userEvent from '@testing-library/user-event'
 import mockStore from '../__mocks__/store'
 import { localStorageMock } from '../__mocks__/localStorage'
 import { ROUTES_PATH, ROUTES } from '../constants/routes.js'
 import NewBill from '../containers/NewBill'
 import Router from '../app/Router'
 import formatPicture from '../containers/NewBill'

 //import BillsContainer from "../containers/Bills"
 //import router from "../app/Router.js";
 //import BillsUI from "../views/BillsUI.js"
 import { fireEvent, screen, waitFor, prettyDOM } from '@testing-library/dom'


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test('Then mail icon in vertical layout should be highlighted', () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })

      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
      Router()   

      const icon = screen.getByTestId('icon-mail')
      expect(icon.className).toBe('active-icon')
    })
  })
   

  describe('When I am on NewBill Page ans i click on button change file', () => {
    test('Then i can choose file with good extension (jpg|jpeg|png)', async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })

      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
      Router()

      const newBill = new NewBill({document,  onNavigate, store: mockStore, localStorage: window.localStorage})
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      const img = new File(['img'], 'image.png', {type:'image/png'})
      
      inputFile.addEventListener('change', handleChangeFile)      
      await waitFor(() => { userEvent.upload(inputFile, img) })
     
      //expect(inputFile.files[0].name).toBe('image.png')
      expect(handleChangeFile).toBeCalled()
      expect(screen.getAllByText('Billed')).toBeTruthy()
      const icon = screen.getByTestId('icon-mail')
      expect(icon.className).toBe('active-icon')
      expect(formatPicture).not.toBe(0)

    })
    test('Then i choose file with bad extension', async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })

      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
      Router()

      const newBill = new NewBill({document,  onNavigate, store: mockStore, localStorage: window.localStorage})
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')
      
      const img = new File(['img'], 'image.pdf', {type:'image/pdf'})

      inputFile.addEventListener('change', handleChangeFile)      
      await waitFor(() => { userEvent.upload(inputFile, [img]) })

      expect(formatPicture).not.toBe(1)
    })
  })








  // Test d'integration POST
  describe('Given i am connected as an employee', () => {
    describe('When I am on NewBills Page', () => {
      test('send bills to API, method POST', async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })

        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
        document.body.innerHTML = `<div id="root"></div>`
        Router()

        const newBill = new NewBill({document,  onNavigate, store: mockStore, localStorage: window.localStorage})
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      
        const inputType = screen.getByTestId('expense-type')
        const inputName = screen.getByTestId('expense-name')
        const inputDate = screen.getByTestId('datepicker')
        const inputAmount = screen.getByTestId('amount')
        const inputVat = screen.getByTestId('vat')
        const inputPct = screen.getByTestId('pct')
        const inputComment= screen.getByTestId('commentary')
        const inputFile = screen.getByTestId('file')
        const img = new File(['img'], 'image.png', {type:'image/png'})

        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

        inputType.value = 'Transports'
        inputName.value = 'Vol Cholet nantes'
        inputDate.value = '2022-03-26'
        inputAmount.value = '55'
        inputVat.value = 70
        inputPct.value = 20
        inputComment.value = 'Visite commerciale'
        inputFile.addEventListener('change', handleChangeFile)      
        await waitFor(() => { userEvent.upload(inputFile, [img]) })

        expect(inputType.validity.valid).toBeTruthy()
        expect(inputName.validity.valid).toBeTruthy()
        expect(inputDate.validity.valid).toBeTruthy()
        expect(inputAmount.validity.valid).toBeTruthy()
        expect(inputVat.validity.valid).toBeTruthy()
        expect(inputPct.validity.valid).toBeTruthy()
        expect(inputComment.validity.valid).toBeTruthy()
        expect(inputFile.files[0]).toBeDefined()

        
        const formulaire = screen.getByTestId("form-new-bill")
        expect(formulaire).toBeTruthy
        formulaire.addEventListener("submit", handleSubmit);
        
        //const submitButton = screen.getByTestId('btn-send-bill')
        fireEvent.submit(formulaire)

        expect(handleSubmit).toHaveBeenCalled();
        //expect(screen.getByTestId("icon-eye-d").toBeTruthy)

        /*jest.spyOn(mockStore, "bills")
        //erreur 500
          mockStore.bills.mockImplementationOnce(() => {
            return {
              create : () =>  {
                //ajouter info dans input
                return Promise.reject(new Error('Erreur 404'))
              }
            }})
            //fireEvent.submit(formulaire)
            fireEvent.click(submitButton)
            screen.debug()
          //window.onNavigate(ROUTES_PATH.Bills)//
          await new Promise(process.nextTick)
          const message = await waitFor(() => screen.getByText("Erreur"))
          //message doit être erreur
          expect(message).toBeTruthy()*/

      })
    })
  })
})


/*
// Test d'integration POST
describe('Given I am connected as an employee', () => {
  describe('When I am on NewBills Page', () => {
    test('fetches bills to mock API POST', async () => {   
  
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      Router()
      window.onNavigate(ROUTES_PATH.Bills)
      
      expect(await waitFor(() => screen.getByText('Mes notes de frais'))).toBeTruthy()
      expect(await waitFor(() => screen.getByTestId('tbody'))).toBeTruthy()
      expect(screen.getAllByText('encore'))

      //const html = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) })
      //document.body.innerHTML = html

      //const billsContainer = new BillsContainer({
        //document, onNavigate, store: mockStore, localStorage: window.localStorage
      //})
  
      /*const handleShowModalNewBill = jest.fn((e) => billsContainer.handleClickNewBill(e))
      const btnNewBill = screen.getByTestId('btn-new-bill')
  
      btnNewBill.addEventListener('click', handleShowModalNewBill)
      userEvent.click(btnNewBill)
      expect(handleShowModalNewBill).toHaveBeenCalled()
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()*//*
    })
  })
  describe('When an error occurs on API', () => {
    beforeEach(() => {
      jest.spyOn(mockStore, 'bills')
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a'}))
      document.body.innerHTML = `<div id="root"></div>`  
      Router()

      //expect(await waitFor(() => screen.getByText('Mes notes de frais'))).toBeTruthy()
      //expect(await waitFor(() => screen.getByTestId('tbody'))).toBeTruthy()
      //expect(screen.getAllByText('encore'))

      const html = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) })
      document.body.innerHTML = html

      const billsContainer = new BillsContainer({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      
      const handleShowModalNewBill = jest.fn((e) => billsContainer.handleClickNewBill(e))
      const btnNewBill = screen.getByTestId('btn-new-bill')
  
      btnNewBill.addEventListener('click', handleShowModalNewBill)
      userEvent.click(btnNewBill)
      expect(handleShowModalNewBill).toHaveBeenCalled()
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

    test('fetches bills to an API and fails with 404 message error', async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () =>  {
            //ajouter info dans input
            return Promise.reject(new Error('Erreur 404'))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)
      const message = await waitFor(() => screen.getByText(/Erreur 404/))
      //message doit être erreur
      expect(message).toBeTruthy()
    })

    /*test('fetches messages from an API and fails with 500 message error', async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error('Erreur 500'))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)
      const message = await waitFor(() => screen.getByText(/Erreur 500/))
      expect(message).toBeTruthy()
    })*//*
  })
})*/

/*
describe("test", () => {
  describe("xtest", () => {
    test('xxtest', () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })

      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
      Router()   

      const icon = screen.getByTestId('icon-mail')
      expect(icon.className).toBe('active-icon')
    })
  })
})*/