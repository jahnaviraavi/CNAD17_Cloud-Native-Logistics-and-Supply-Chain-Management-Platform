
import { useEffect, useState } from 'react'
import api from './api'
import './App.css'

const inputStyle = {}
const buttonStyle = {}

const statuses = {
  Orders: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  Shipments: ['PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
  Deliveries: ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'],
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [shipments, setShipments] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [statusChoices, setStatusChoices] = useState({})
  const [editingUser, setEditingUser] = useState(null)

  const emptyUserForm = {
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  }

  const [userForm, setUserForm] = useState(emptyUserForm)

  const [productForm, setProductForm] = useState({
    name: '', quantity: '', price: '',
  })

  const [orderForm, setOrderForm] = useState({
    customerName: '', productName: '', quantity: '',
  })

  const [shipmentForm, setShipmentForm] = useState({
    orderId: '', destination: '', trackingNumber: '',
  })

  const [deliveryForm, setDeliveryForm] = useState({
    shipmentId: '', deliveryPerson: '', deliveryAddress: '',
  })

  const menu = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'Inventory', icon: '▤' },
    { name: 'Orders', icon: '▣' },
    { name: 'Shipments', icon: '🚚' },
    { name: 'Deliveries', icon: '⌖' },
    { name: 'Users', icon: '♙' },
  ]

  const endpoints = {
    Inventory: '/products',
    Orders: '/orders',
    Shipments: '/shipments',
    Deliveries: '/deliveries',
    Users: '/users',
  }

  const setters = {
    Inventory: setProducts,
    Orders: setOrders,
    Shipments: setShipments,
    Deliveries: setDeliveries,
    Users: setUsers,
  }

  async function loadPage(page) {
    if (page === 'Dashboard') {
      await Promise.allSettled([
        loadPage('Inventory'),
        loadPage('Orders'),
        loadPage('Shipments'),
        loadPage('Deliveries'),
        loadPage('Users'),
      ])
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.get(endpoints[page])
      setters[page](
        Array.isArray(response.data) ? response.data : []
      )
    } catch (err) {
      console.error(`Failed to load ${page}:`, err)
      setError(`Could not load ${page}. Check your backend.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage(activePage)
  }, [activePage])

  function changePage(page) {
    setActivePage(page)
    setShowForm(false)
    setEditingUser(null)
    setUserForm(emptyUserForm)
    setMessage('')
    setError('')
  }

  async function saveRecord(endpoint, payload, successMessage, page, resetForm) {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      await api.post(endpoint, payload)
      setMessage(successMessage)
      resetForm()
      setShowForm(false)
      await loadPage(page)
    } catch (err) {
      console.error('Save failed:', err)
      setMessage(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string'
          ? err.response.data
          : 'Save failed. Check the backend console.')
      )
    } finally {
      setSaving(false)
    }
  }

  async function addProduct(event) {
    event.preventDefault()

    const name = productForm.name.trim()
    const quantity = Number(productForm.quantity)
    const price = Number(productForm.price)

    if (!name || !Number.isInteger(quantity) || quantity < 0 ||
        !Number.isFinite(price) || price < 0) {
      setMessage('Enter a valid product name, quantity and price.')
      return
    }

    await saveRecord(
      '/products',
      { name, quantity, price },
      'Product added successfully!',
      'Inventory',
      () => setProductForm({ name: '', quantity: '', price: '' })
    )
  }

  async function addOrder(event) {
    event.preventDefault()

    const customerName = orderForm.customerName.trim()
    const productName = orderForm.productName.trim()
    const quantity = Number(orderForm.quantity)

    if (!customerName || !productName ||
        !Number.isInteger(quantity) || quantity < 1) {
      setMessage('Enter the customer, product and a valid quantity.')
      return
    }

    await saveRecord(
      '/orders',
      { customerName, productName, quantity },
      'Order created successfully!',
      'Orders',
      () => setOrderForm({
        customerName: '', productName: '', quantity: '',
      })
    )
  }

  async function addShipment(event) {
    event.preventDefault()

    const orderId = Number(shipmentForm.orderId)
    const destination = shipmentForm.destination.trim()
    const trackingNumber = shipmentForm.trackingNumber.trim()

    if (!Number.isInteger(orderId) || orderId < 1 ||
        !destination || !trackingNumber) {
      setMessage('Enter a valid order ID, destination and tracking number.')
      return
    }

    await saveRecord(
      '/shipments',
      { orderId, destination, trackingNumber, status: 'PROCESSING' },
      'Shipment created successfully!',
      'Shipments',
      () => setShipmentForm({
        orderId: '', destination: '', trackingNumber: '',
      })
    )
  }

  async function addDelivery(event) {
    event.preventDefault()

    const shipmentId = Number(deliveryForm.shipmentId)
    const deliveryPerson = deliveryForm.deliveryPerson.trim()
    const deliveryAddress = deliveryForm.deliveryAddress.trim()

    if (!Number.isInteger(shipmentId) || shipmentId < 1 ||
        !deliveryPerson || !deliveryAddress) {
      setMessage('Enter a valid shipment ID, delivery person and address.')
      return
    }

    await saveRecord(
      '/deliveries',
      {
        shipmentId, deliveryPerson, deliveryAddress, status: 'PENDING',
      },
      'Delivery created successfully!',
      'Deliveries',
      () => setDeliveryForm({
        shipmentId: '', deliveryPerson: '', deliveryAddress: '',
      })
    )
  }

  async function saveUser(event) {
    event.preventDefault()

    const name = userForm.name.trim()
    const email = userForm.email.trim()
    const role = userForm.role || 'CUSTOMER'

    if (!name || !email || (!editingUser && !userForm.password.trim())) {
      setMessage(
        editingUser
          ? 'Enter the user name and email.'
          : 'Enter name, email and password.'
      )
      return
    }

    const payload = { name, email, role }

    if (userForm.password.trim()) {
      payload.password = userForm.password
    }

    setSaving(true)
    setMessage('')
    setError('')

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload)
        setMessage('User updated successfully!')
      } else {
        await api.post('/users', payload)
        setMessage('User registered successfully!')
      }

      setUserForm(emptyUserForm)
      setEditingUser(null)
      setShowForm(false)
      await loadPage('Users')
    } catch (err) {
      console.error('User save failed:', err)
      const data = err.response?.data
      setMessage(
        data?.message ||
        (typeof data === 'string' ? data : 'Could not save user. Check the backend.')
      )
    } finally {
      setSaving(false)
    }
  }

  function startEditUser(user) {
    setEditingUser(user)
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'CUSTOMER',
    })
    setShowForm(true)
    setMessage('')
    setError('')
  }

  async function deleteUser(user) {
    if (!window.confirm(
      `Delete user ${user.name || user.email}? This cannot be undone.`
    )) return

    setSaving(true)
    setMessage('')
    setError('')

    try {
      await api.delete(`/users/${user.id}`)
      setMessage('User deleted successfully!')

      if (editingUser?.id === user.id) {
        setEditingUser(null)
        setUserForm(emptyUserForm)
        setShowForm(false)
      }

      await loadPage('Users')
    } catch (err) {
      console.error('User delete failed:', err)
      setMessage(
        err.response?.data?.message ||
        'Could not delete user. Check the backend console.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(page, id) {
    const status = statusChoices[`${page}-${id}`]

    if (!status) {
      setMessage('Choose a status first.')
      return
    }

    setSaving(true)
    setMessage('')
    setError('')

    try {
      await api.put(`/${page.toLowerCase()}/${id}/status`, { status })
      setMessage('Status updated successfully!')
      await loadPage(page)
    } catch (err) {
      console.error('Status update failed:', err)
      setMessage(
        err.response?.data?.message ||
        'Status update failed. Check the backend console.'
      )
    } finally {
      setSaving(false)
    }
  }

  const stats = [
    { title: 'Total Products', value: products.length, icon: '▤', color: 'blue' },
    { title: 'Total Orders', value: orders.length, icon: '▣', color: 'purple' },
    { title: 'Shipments', value: shipments.length, icon: '🚚', color: 'orange' },
    { title: 'Deliveries', value: deliveries.length, icon: '⌖', color: 'green' },
  ]

  function renderForm() {
    if (!showForm) return null

    const formStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 12,
      padding: '18px 0',
    }

    if (activePage === 'Inventory') {
      return (
        <form onSubmit={addProduct} style={formStyle}>
          <label>Product name
            <input required maxLength={100} style={inputStyle}
              placeholder="e.g. Laptop"
              value={productForm.name}
              onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
          </label>
          <label>Quantity
            <input required type="number" min="0" step="1" style={inputStyle}
              value={productForm.quantity}
              onChange={e => setProductForm({ ...productForm, quantity: e.target.value })} />
          </label>
          <label>Price (₹)
            <input required type="number" min="0" step="0.01" style={inputStyle}
              value={productForm.price}
              onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
          </label>
          <button style={buttonStyle} disabled={saving}>
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )
    }

    if (activePage === 'Orders') {
      return (
        <form onSubmit={addOrder} style={formStyle}>
          <label>Customer name
            <input required style={inputStyle} value={orderForm.customerName}
              onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
          </label>
          <label>Product name
            <input required style={inputStyle} value={orderForm.productName}
              onChange={e => setOrderForm({ ...orderForm, productName: e.target.value })} />
          </label>
          <label>Quantity
            <input required type="number" min="1" step="1" style={inputStyle}
              value={orderForm.quantity}
              onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })} />
          </label>
          <button style={buttonStyle} disabled={saving}>
            {saving ? 'Saving...' : 'Create Order'}
          </button>
        </form>
      )
    }

    if (activePage === 'Shipments') {
      return (
        <form onSubmit={addShipment} style={formStyle}>
          <label>Order ID
            <input required type="number" min="1" step="1" style={inputStyle}
              placeholder="Existing order ID"
              value={shipmentForm.orderId}
              onChange={e => setShipmentForm({ ...shipmentForm, orderId: e.target.value })} />
          </label>
          <label>Destination
            <input required style={inputStyle} placeholder="Delivery destination"
              value={shipmentForm.destination}
              onChange={e => setShipmentForm({ ...shipmentForm, destination: e.target.value })} />
          </label>
          <label>Tracking number
            <input required style={inputStyle} placeholder="e.g. TRK1002"
              value={shipmentForm.trackingNumber}
              onChange={e => setShipmentForm({ ...shipmentForm, trackingNumber: e.target.value })} />
          </label>
          <button style={buttonStyle} disabled={saving}>
            {saving ? 'Saving...' : 'Create Shipment'}
          </button>
        </form>
      )
    }

    if (activePage === 'Deliveries') {
      return (
        <form onSubmit={addDelivery} style={formStyle}>
          <label>Shipment ID
            <input required type="number" min="1" step="1" style={inputStyle}
              placeholder="Existing shipment ID"
              value={deliveryForm.shipmentId}
              onChange={e => setDeliveryForm({ ...deliveryForm, shipmentId: e.target.value })} />
          </label>
          <label>Delivery person
            <input required style={inputStyle} placeholder="Person responsible"
              value={deliveryForm.deliveryPerson}
              onChange={e => setDeliveryForm({ ...deliveryForm, deliveryPerson: e.target.value })} />
          </label>
          <label>Delivery address
            <input required style={inputStyle} placeholder="Full delivery address"
              value={deliveryForm.deliveryAddress}
              onChange={e => setDeliveryForm({ ...deliveryForm, deliveryAddress: e.target.value })} />
          </label>
          <button style={buttonStyle} disabled={saving}>
            {saving ? 'Saving...' : 'Create Delivery'}
          </button>
        </form>
      )
    }

    if (activePage === 'Users') {
      return (
        <form onSubmit={saveUser} style={formStyle}>
          <label>Full name
            <input required maxLength={100} style={inputStyle}
              placeholder="Enter full name"
              value={userForm.name}
              onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
          </label>

          <label>Email
            <input required type="email" style={inputStyle}
              placeholder="name@example.com"
              value={userForm.email}
              onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
          </label>

          <label>
            {editingUser ? 'New password (optional)' : 'Password'}
            <input
              required={!editingUser}
              type="password"
              minLength="8"
              style={inputStyle}
              placeholder={editingUser ? 'Leave blank to keep current' : 'At least 8 characters'}
              value={userForm.password}
              onChange={e => setUserForm({ ...userForm, password: e.target.value })}
            />
          </label>

          <label>Role
            <select style={inputStyle} value={userForm.role}
              onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </label>

          <button type="submit" style={buttonStyle} disabled={saving}>
            {saving ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
          </button>

          {editingUser && (
            <button type="button" style={buttonStyle}
              onClick={() => {
                setEditingUser(null)
                setUserForm(emptyUserForm)
                setShowForm(false)
                setMessage('')
              }}>
              Cancel Edit
            </button>
          )}
        </form>
      )
    }

    return null
  }

  function renderTable() {
    const configs = {
      Inventory: {
        data: products,
        columns: [['id', 'ID'], ['name', 'Product'], ['quantity', 'Quantity'], ['price', 'Price']],
      },
      Orders: {
        data: orders,
        columns: [['id', 'ID'], ['customerName', 'Customer'], ['productName', 'Product'], ['quantity', 'Quantity'], ['status', 'Status']],
      },
      Shipments: {
        data: shipments,
        columns: [['id', 'ID'], ['orderId', 'Order ID'], ['destination', 'Destination'], ['trackingNumber', 'Tracking Number'], ['status', 'Status']],
      },
      Deliveries: {
        data: deliveries,
        columns: [['id', 'ID'], ['shipmentId', 'Shipment ID'], ['deliveryPerson', 'Delivery Person'], ['deliveryAddress', 'Delivery Address'], ['status', 'Status']],
      },
      Users: {
        data: users,
        columns: [['id', 'ID'], ['name', 'Name'], ['email', 'Email'], ['role', 'Role']],
      },
    }

    const config = configs[activePage]
    if (!config) return null

    const canCreate = ['Inventory', 'Orders', 'Shipments', 'Deliveries', 'Users'].includes(activePage)
    const canUpdate = ['Orders', 'Shipments', 'Deliveries'].includes(activePage)
    const canManageUsers = activePage === 'Users'

    return (
      <section className="panel" style={{ marginTop: 24 }}>
        <div className="panel-heading">
          <div>
            <h2>
              {activePage === 'Inventory' ? 'Product Inventory' : `${activePage} Management`}
            </h2>
            <p>Data retrieved from your backend</p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {canCreate && (
              <button style={buttonStyle} onClick={() => {
                if (showForm) {
                  setShowForm(false)
                  setEditingUser(null)
                  setUserForm(emptyUserForm)
                } else {
                  setShowForm(true)
                  setEditingUser(null)
                  setUserForm(emptyUserForm)
                }
                setMessage('')
              }}>
                {showForm ? 'Cancel' : activePage === 'Users' ? '+ Add User' : `+ Create ${activePage === 'Inventory' ? 'Product' : activePage === 'Orders' ? 'Order' : activePage.slice(0, -1)}`}
              </button>
            )}

            <button style={buttonStyle} onClick={() => loadPage(activePage)}>
              Refresh
            </button>
          </div>
        </div>

        {renderForm()}

        {message && (
          <p role="status" style={{
            color: /successfully/i.test(message) ? '#16845b' : '#c0392b',
            fontSize: 13,
          }}>{message}</p>
        )}

        {loading && <p>Loading {activePage.toLowerCase()}...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  {config.columns.map(([key, label]) => (
                    <th key={key} style={{
                      padding: '14px 12px',
                      borderBottom: '1px solid #edf0f5',
                    }}>{label}</th>
                  ))}
                  {canUpdate && (
                    <th style={{ padding: '14px 12px', borderBottom: '1px solid #edf0f5' }}>
                      Update Status
                    </th>
                  )}
                  {canManageUsers && (
                    <th style={{ padding: '14px 12px', borderBottom: '1px solid #edf0f5' }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {config.data.map(item => (
                  <tr key={item.id}>
                    {config.columns.map(([key]) => (
                      <td key={key} style={{
                        padding: '14px 12px',
                        borderBottom: '1px solid #edf0f5',
                        fontSize: 13,
                      }}>
                        {key === 'price'
                          ? Number(item.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                          : (key === 'status' || key === 'role') && item[key]
                            ? <span className="badge" data-s={item[key]}>{item[key].replace('_', ' ')}</span>
                            : item[key] ?? '—'}
                      </td>
                    ))}

                    {canUpdate && (
                      <td style={{
                        padding: '14px 12px',
                        borderBottom: '1px solid #edf0f5',
                        minWidth: 180,
                      }}>
                        <div style={{ display: 'grid', gap: 8 }}>
                          <select
                            style={inputStyle}
                            value={statusChoices[`${activePage}-${item.id}`] ?? item.status ?? ''}
                            onChange={e => setStatusChoices({
                              ...statusChoices,
                              [`${activePage}-${item.id}`]: e.target.value,
                            })}
                          >
                            <option value="" disabled>Select status</option>
                            {(statuses[activePage] || []).map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>

                          <button style={buttonStyle} disabled={saving}
                            onClick={() => updateStatus(activePage, item.id)}>
                            {saving ? 'Saving...' : 'Update'}
                          </button>
                        </div>
                      </td>
                    )}

                    {canManageUsers && (
                      <td style={{
                        padding: '14px 12px',
                        borderBottom: '1px solid #edf0f5',
                        minWidth: 150,
                      }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button style={buttonStyle} disabled={saving}
                            onClick={() => startEditUser(item)}>
                            Edit
                          </button>

                          <button
                            style={{ ...buttonStyle, color: '#c0392b' }}
                            disabled={saving}
                            onClick={() => deleteUser(item)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {config.data.length === 0 && (
                  <tr>
                    <td
                      colSpan={config.columns.length + (canUpdate ? 1 : 0) + (canManageUsers ? 1 : 0)}
                      style={{ padding: 18, color: '#7b879b' }}>
                      No {activePage.toLowerCase()} found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">L</div>
          <div>
            <h2>LogiFlow</h2>
            <span>Supply chain platform</span>
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav>
          {menu.map(item => (
            <button key={item.name}
              className={`nav-item ${activePage === item.name ? 'active' : ''}`}
              onClick={() => changePage(item.name)}>
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === 'Orders' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="online-dot" />
          <span>System operational</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / {activePage}</p>
            <h1>{activePage}</h1>
          </div>

          <div className="profile">
            <div className="avatar">J</div>
            <div><strong>Administrator</strong><span>Control Center</span></div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <span className="eyebrow">Logistics overview</span>
            <h2>Your supply chain, <span>under control.</span></h2>
            <p>Monitor products, manage orders and track deliveries from one place.</p>
          </div>
          <div className="welcome-art">↗</div>
        </section>

        {activePage === 'Dashboard' ? (
          <>
            <div className="section-heading">
              <div>
                <h2>Operations Overview</h2>
                <p>Your platform statistics from the backend.</p>
              </div>
              <span className="status"><span /> Backend integration</span>
            </div>

            <section className="stats">
              {stats.map(stat => (
                <article className="stat-card" key={stat.title}>
                  <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                  <span className="stat-note">Retrieved from API</span>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <article className="panel">
                <div className="panel-heading">
                  <div><h2>Quick Actions</h2><p>Choose an operation to get started.</p></div>
                  <span className="panel-symbol">✦</span>
                </div>

                <div className="actions">
                  {[
                    ['Inventory', 'Manage products and stock', '▤'],
                    ['Orders', 'Review customer orders', '▣'],
                    ['Shipments', 'Track shipment progress', '🚚'],
                    ['Deliveries', 'Manage delivery operations', '⌖'],
                    ['Users', 'Manage registered users', '♙'],
                  ].map(([name, description, icon]) => (
                    <button className="action-row" key={name}
                      onClick={() => changePage(name)}>
                      <span className="action-icon">{icon}</span>
                      <span className="action-copy">
                        <strong>{name}</strong>
                        <small>{description}</small>
                      </span>
                      <span className="action-arrow">→</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel activity-panel">
                <div className="panel-heading">
                  <div><h2>Platform Modules</h2><p>Your application components</p></div>
                </div>

                {[
                  ['01', 'Product Inventory'],
                  ['02', 'Order Management'],
                  ['03', 'Shipment Tracking'],
                  ['04', 'Delivery Management'],
                  ['05', 'User Management'],
                ].map(([number, name]) => (
                  <div className="module-row" key={number}>
                    <span className="module-number">{number}</span>
                    <div><strong>{name}</strong><small>Spring Boot + MySQL</small></div>
                    <span className="module-check">✓</span>
                  </div>
                ))}
              </article>
            </section>
          </>
        ) : renderTable()}

        <footer>
          <span>LogiFlow · Cloud Logistics Platform</span>
          <span>React + Spring Boot + MySQL</span>
        </footer>
      </main>
    </div>
  )
}

export default App
