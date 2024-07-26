import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './providerSearch.css';
import { Container, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faAnglesLeft, faAnglesRight, faNoteSticky, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const stateAbbreviations = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', AS: 'American Samoa',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', GU: 'Guam', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  MP: 'Northern Mariana Islands', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  PR: 'Puerto Rico', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', TT: 'Trust Territories', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', VI: 'Virgin Islands',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};


function ProviderSearch() {
  const [searchParams, setSearchParams] = useState({
    providerName: '',
    city: '',
    state: '',
    specialty: '',
    npi: ''
  });
  const [searchSummaryParams, setSearchSummaryParams] = useState({});
  const [providers, setProviders] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [statesAndCities, setStatesAndCities] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentRecordRange, setCurrentRecordRange] = useState({ start: 0, end: 0 });
  // State for Notes Modal
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState([]);
  const [noteAttempts, setNoteAttempts] = useState('Default'); 
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_API_KEY;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Close modal function
  const handleCloseModalListNotes = () => {
    setModalOpen(false);
    setSelectedProvider(null);
    setNote('');
  };
  
  const handleAddNote = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleSaveNote = async () => {
    try {
      const metadata = {
        createdBy: 'Leo', // Adjust this as necessary
      };
  
      await axios.post(`${backendUrl}/providers/${selectedProvider.npi}/notes`, {
        noteAttempts,
        noteText: note,
        metadata,
      });
  
      setNote('');
      setNoteAttempts('Default');
      setShowModal(false);
      // Optionally, refresh provider data here
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  
  const fetchProviderNotes = async (npi) => {
    try {
      const response = await axios.get(`${backendUrl}/providers/${npi}/notes`);
      setNote(response.data || []);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };
  
  const handleButtonClick = useCallback(async (provider) => {
    setSelectedProvider(provider);
    await fetchProviderNotes(provider.npi);
    setModalOpen(true);
    // eslint-disable-next-line
  }, []);

  

  useEffect(() => {
    setTotalRecords(providers.length);
  }, [providers]);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalRecords);
    setCurrentRecordRange({ start, end });
  }, [currentPage, itemsPerPage, totalRecords]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specialtiesResponse = await axios.get(`${backendUrl}/specialties`);
        setSpecialties(specialtiesResponse.data);
    
        const statesResponse = await axios.get(`${backendUrl}/states`);
        const stateCityMap = {};
        for (const state of statesResponse.data) {
          const citiesResponse = await axios.get(`${backendUrl}/cities/${state}`);
          stateCityMap[state] = citiesResponse.data;
        }
        setStatesAndCities(stateCityMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };    
    fetchData();
    // eslint-disable-next-line
  }, []);
  

  useEffect(() => {
    if (searchParams.state && statesAndCities[searchParams.state]) {
      setSearchParams(prevParams => ({ ...prevParams, city: '' }));
    }
  }, [searchParams.state, statesAndCities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSelectChange = async (selectedOption, { name }) => {
    if (name === 'state') {
      const selectedState = selectedOption ? selectedOption.value : '';
      setSearchParams({ ...searchParams, [name]: selectedState, city: '' });
  
      if (selectedState) {
        try {
          const citiesResponse = await axios.get(`${backendUrl}/cities/${selectedState}`);
          const cities = citiesResponse.data;
          setStatesAndCities(prevState => ({
            ...prevState,
            [selectedState]: cities
          }));
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    } else {
      setSearchParams({ ...searchParams, [name]: selectedOption ? selectedOption.value : '' });
    }
  };
  
  
  
  const [hasSearched, setHasSearched] = useState(false);
// Inside ProviderSearch component

useEffect(() => {
  if (searchParams.state && statesAndCities[searchParams.state]) {
    // Check if the selected city is valid for the newly selected state
    const selectedCity = searchParams.city;
    const validCities = statesAndCities[searchParams.state];
    if (selectedCity && validCities.includes(selectedCity)) {
      // Preserve the selected city if it exists in the new state
      setSearchParams(prevParams => ({ ...prevParams }));
    } else {
      // Reset city to empty if it's not valid for the new state
      setSearchParams(prevParams => ({ ...prevParams, city: '' }));
    }
  }// eslint-disable-next-line
}, [searchParams.state, statesAndCities]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchSubmitted(true);
    setSearchSummaryParams(searchParams);
    setProviders([]);
    setHasSearched(true);

    try {
      let response;
      if (searchParams.npi) {
        response = await axios.get(`${backendUrl}/providers/${searchParams.npi}`);
        setProviders([response.data]);
      } else {
        response = await axios.get(`${backendUrl}/providers`, { params: searchParams });
        setProviders(response.data);
      }
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
    setLoading(false);
  };

  const paginationSummary = hasSearched ? `Displaying ${currentRecordRange.start} - ${currentRecordRange.end} of ${totalRecords} records` : '';

  const handleClear = () => {
    setSearchParams({
      providerName: '',
      city: '',
      state: '',
      specialty: '',
      npi: ''
    });
  };

  const specialtyOptions = specialties.map(specialty => ({
    value: specialty,
    label: specialty
  }));

  const stateOptions = [
    ...Object.keys(stateAbbreviations).map(abbr => ({
      value: abbr,
      label: `${abbr} - ${stateAbbreviations[abbr]}`
    })),
    { value: 'Others', label: 'Others' }
  ];
  
  

  const cityOptions = searchParams.state && Array.isArray(statesAndCities[searchParams.state])
  ? statesAndCities[searchParams.state].map(city => ({
      value: city,
      label: city
    }))
  : [];



  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = providers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const maxPageNumbers = 5;
    let startPage, endPage;

    if (totalPages <= maxPageNumbers) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPageNumbers / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPageNumbers / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPageNumbers;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPageNumbers + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage !== 1) {
      pageNumbers.unshift(1);
    }
    if (endPage !== totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleItemsPerPageChange = (selectedOption) => {
    const itemsPerPageValue = selectedOption.value;
    setItemsPerPage(itemsPerPageValue);
    setTotalPages(Math.ceil(providers.length / itemsPerPageValue));
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "NPI",
      "providerName",
      "Gender",
      "NPIType",
      "SoleProprietor",
      "Specialty",
      "Mailing Street",
      "Mailing City",
      "Mailing State",
      "Mailing Zipcode",
      "Primary Street",
      "Primary City",
      "Primary State",
      "Primary Zipcode",
      "Phone Mailing",
      "Phone Primary",
      "Fax Number",
      "Status"
    ].join(",");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" +
      providers.map(provider => {
        const { npi, providerName, gender, npiType, soleProprietor, specialty, addresses, phones, faxes, status } = provider;
        const mailingAddress = addresses.find(address => address.addressType === 'Mailing');
        const primaryAddress = addresses.find(address => address.addressType === 'Primary');
        const mailingStreetStr = mailingAddress ? `${mailingAddress.addressNo}` : '';
        const mailingCityStr = mailingAddress ? `${mailingAddress.city}` : '';
        const mailingStateStr = mailingAddress ? `${mailingAddress.state}` : '';
        const mailingZipCodeStr = mailingAddress ? `${mailingAddress.zip}` : '';
        const primaryStreetStr = primaryAddress ? `${primaryAddress.addressNo}` : '';
        const primaryCityStr = primaryAddress ? `${primaryAddress.city}` : '';
        const primaryStateStr = primaryAddress ? `${primaryAddress.state}` : '';
        const primaryZipCodeStr = primaryAddress ? `${primaryAddress.zip}` : '';
        const mailingPhone = phones.find(phone => phone.phoneType === 'Mailing');
        const primaryPhone = phones.find(phone => phone.phoneType === 'Primary');
        const faxNumber = faxes.length > 0 ? faxes[0].faxNumber : '';
        return [
          npi,
          providerName,
          gender,
          npiType,
          soleProprietor,
          specialty,
          mailingStreetStr,
          mailingCityStr,
          mailingStateStr,
          mailingZipCodeStr,
          primaryStreetStr,
          primaryCityStr,
          primaryStateStr,
          primaryZipCodeStr,
          mailingPhone ? mailingPhone.phoneNumber : '',
          primaryPhone ? primaryPhone.phoneNumber : '',
          faxNumber,
          status
        ].join(",");
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "providerDetails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
// eslint-disable-next-line
  const filteredResults = currentResults.filter(provider => {
    return provider.notes.some(note => {
      if (noteAttempts === 'Default') {
        return !note.noteAttempts; // Show if noteAttempts is empty
      }
      return note.noteAttempts === noteAttempts; // Match the selected noteAttempt
    });
  });
  
  return (
    <Container style={{ marginTop: '30px' }}>
      <Row className="justify-content-center">
        <Col md={10}>
          <h1 style={{ marginBottom: '30px' }}>Find a Provider: </h1>
          <Form onSubmit={handleSubmit}>
            <Row style={{ marginBottom: '30px' }}>
              <Col md={6}>
                <Form.Label className="forms">Provider Name</Form.Label>
                <Form.Group controlId="providerName">
                  <Form.Control
                    type="text"
                    placeholder="Enter provider name"
                    name="providerName"
                    value={searchParams.providerName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Label className="forms">NPI</Form.Label>
                <Form.Group controlId="npi">
                  <Form.Control
                    type="text"
                    placeholder="NPI"
                    name="npi"
                    value={searchParams.npi}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Label className="forms">Specialty</Form.Label>
                <Select
                  name="specialty"
                  value={searchParams.specialty ? specialtyOptions.find(option => option.value === searchParams.specialty) : ''}
                  onChange={handleSelectChange}
                  options={specialtyOptions}
                  placeholder="Specialty"
                />
              </Col>
              <Col md={3}>
                <Form.Label className="forms">State</Form.Label>
                <Select
                  name="state"
                  value={searchParams.state ? stateOptions.find(option => option.value === searchParams.state) : ''}
                  onChange={handleSelectChange}
                  options={stateOptions}
                  placeholder="State"
                />
              </Col>
              <Col md={3}>
                <Form.Label className="forms">City</Form.Label>
                <Select
                  name="city"
                  value={searchParams.city ? cityOptions.find(option => option.value === searchParams.city) : ''}
                  onChange={handleSelectChange}
                  options={cityOptions}
                  placeholder="City"
                />
              </Col>
              <Col md={1} className="text-center">
                <Button variant="secondary" onClick={handleClear} style={{ marginTop: '30px', backgroundColor: '#133664', borderColor: '#133664', borderRadius: "25px" }}>Clear</Button>
              </Col>
              <Col md={1}>
                <Button type="submit" style={{ marginTop: '30px', backgroundColor: '#133664', borderColor: '#133664', borderRadius: "25px" }}>Search</Button>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col md={4}>
              {searchSubmitted && Object.values(searchSummaryParams).some(param => param) && (
                <div>
                  <h3 style={{ marginTop: '40px' }}>Searching for
                    {searchSummaryParams.providerName && (
                      <p style={{ fontSize: '20px' }}> Provider Name: {searchSummaryParams.providerName},</p>
                    )}
                    {searchSummaryParams.npi && (
                      <p style={{ fontSize: '20px' }}> NPI: {searchSummaryParams.npi},</p>
                    )}
                    {searchSummaryParams.specialty && (
                      <p style={{ fontSize: '18px' }}> Specialty: {searchSummaryParams.specialty},</p>
                    )}
                    {searchSummaryParams.state && (
                      <p style={{ fontSize: '18px' }}> State: {searchSummaryParams.state},</p>
                    )}
                    {searchSummaryParams.city && (
                      <p style={{ fontSize: '18px' }}> City: {searchSummaryParams.city}</p>
                    )}
                  </h3>
                </div>
              )}
            </Col>
            <Col md={4}>
              {providers.length > 10 && (
                <div className="justify-content-center" style={{ alignContent: 'center', marginTop: '50px', marginBottom: '20px' }}>
                  <Button style={{ backgroundColor: 'transparent', border: '0px', color: 'black' }} onClick={() => goToPage(1)} disabled={currentPage === 1}><FontAwesomeIcon icon={faAnglesLeft} /></Button>
                  <Button style={{ backgroundColor: 'transparent', border: '0px', color: 'black' }} onClick={goToPrevPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faChevronLeft} /></Button>
                  {getPageNumbers().map(pageNumber => (
                    <span
                      style={{
                        color: pageNumber === currentPage ? '#133664' : 'black',
                        marginLeft: '6px',
                        marginRight: '6px',
                        cursor: 'pointer',
                        fontSize: pageNumber === currentPage ? '15px' : '12px',
                        fontWeight: pageNumber === currentPage ? 'bold' : 'normal'
                      }}
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </span>
                  ))}
                  <Button style={{ backgroundColor: 'transparent', border: '0px', color: 'black' }} onClick={goToNextPage} disabled={currentPage === totalPages}><FontAwesomeIcon icon={faChevronRight} /></Button>
                  <Button style={{ backgroundColor: 'transparent', border: '0px', color: 'black' }} onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}><FontAwesomeIcon icon={faAnglesRight} /></Button>
                </div>
              )}
            </Col>
            <Col md={2} style={{ marginTop: '50px' }}>
              <Select
                options={[
                  { value: 10, label: '10' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                  { value: 500, label: '500' }
                ]}
                onChange={handleItemsPerPageChange}
                value={{ value: itemsPerPage, label: `${itemsPerPage}` }}
                placeholder="Select Items Per Page"
              />
            </Col>
            <Col md={2} style={{ marginTop: '50px' }}>
              <button onClick={handleDownloadCSV} className="DownloadBtn">
                <span className="DownloadBtn-content">Download</span>
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-center" style={{ marginTop: '30px' }}>
        <Col md={8}>
          {loading && (
            <Container className="justify-content-center" style={{ alignContent: 'center', marginLeft: '40%', marginTop: '50px', marginBottom: '10px' }} >
              <div id="wifi-loader">
                <svg className="circle-outer" viewBox="0 0 86 86">
                  <circle className="back" cx="43" cy="43" r="40"></circle>
                  <circle className="front" cx="43" cy="43" r="40"></circle>
                  <circle className="new" cx="43" cy="43" r="40"></circle>
                </svg>
                <svg className="circle-middle" viewBox="0 0 60 60">
                  <circle className="back" cx="30" cy="30" r="27"></circle>
                  <circle className="front" cx="30" cy="30" r="27"></circle>
                </svg>
                <svg className="circle-inner" viewBox="0 0 34 34">
                  <circle className="back" cx="17" cy="17" r="14"></circle>
                  <circle className="front" cx="17" cy="17" r="14"></circle>
                </svg>
                <div className="text" data-text="Searching"></div>
              </div>
            </Container>
          )}
          <p>{paginationSummary}</p>

          <div className="results">
  {currentResults.map((provider) => (
    <div key={provider._id} className="provider-card">
      <Row>
        <Col md={5}>
          <h4>{provider.providerName}</h4>
          {provider.phones.map((phone, index) => (
            <p key={index}><strong>{phone.phoneType} Phone:</strong> {phone.phoneNumber}</p>
          ))}
          {provider.notes.map((notes, index) => (
            <p key={index}><strong>Note attempt:</strong> {notes.noteAttempts}</p>
          ))}
        </Col>
        <Col md={4}>
          {provider.addresses.map((address) => (
            <div key={address.addressID}>
              <p><strong>{address.addressType} Address:</strong></p>
              <p>{address.addressNo}, {address.city}, {address.state}, {address.zip}</p>
            </div>
          ))}
        </Col>
        <Col md={3}>
          <p><strong>Specialty:</strong> {provider.specialty}</p>
          <p><strong>NPI:</strong> {provider.npi}</p>
          <p title='Add notes' className='btnNote' onClick={() => handleAddNote(provider)}>
            <FontAwesomeIcon icon={faNoteSticky} /> Add notes
          </p>
          <p title='List' className='btnActivity' onClick={() => handleButtonClick(provider)}>
            <FontAwesomeIcon icon={faClockRotateLeft} /> Activity Log
          </p>
        </Col>
      </Row>
    </div>
  ))}
</div>
        </Col>
      </Row>
      {/* Notes Modal */}
      <Modal
  show={showModal}
  onHide={() => setShowModal(false)}
  centered
  size="lg"
  className="custom-modal"
>
  <Modal.Header className='titleModal'>
    <Modal.Title className="modal-title">
      Add Notes for {selectedProvider?.providerName}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body className="modal-body">
    <Form.Group controlId="noteAttempts" className="mt-3">
      <Form.Label>Select Attempt</Form.Label>
      <Form.Select
        value={noteAttempts}
        onChange={(e) => setNoteAttempts(e.target.value)}
        className="mb-3"
      >
        <option value="Default">Default</option>
        <option value="First Attempt">First Attempt</option>
        <option value="Second Attempt">Second Attempt</option>
        <option value="Third Attempt">Third Attempt</option>
      </Form.Select>
    </Form.Group>

    <Form.Group controlId="note" className="mt-3">
      <Form.Label>Notes</Form.Label>
      <Form.Control
        as="textarea"
        rows={5}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter your notes here..."
        className="note-input"
        style={{ resize: 'none' }}
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer className="modal-footer">
    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleSaveNote}>
      Save Note
    </Button>
  </Modal.Footer>
</Modal>

<Modal
  show={modalOpen}
  onHide={handleCloseModalListNotes}
  centered
  size="lg"
  className="custom-modal"
>
  <Modal.Header className='titleModal'>
    <Modal.Title >Notes for {selectedProvider?.providerName}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {Array.isArray(note) && note.length > 0 ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='text-center'><strong>Created By</strong></TableCell>
              <TableCell className='text-center'><strong>Note Text</strong></TableCell>
              <TableCell className='text-center'><strong>Date</strong></TableCell>
              <TableCell className='text-center'><strong>Attempt</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {note.map((n, index) => (
              <TableRow key={index}>
                <TableCell className='text-center'><strong>{n.metadata.createdBy}</strong></TableCell>
                <TableCell className='text-center'>{n.noteText}</TableCell>
                <TableCell className='text-center'>{new Date(n.metadata.createDate).toLocaleDateString()}</TableCell>
                <TableCell className='text-center'>{n.noteAttempts || 'Default'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <p className='text-center'><strong>No notes available.</strong></p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline-secondary" onClick={handleCloseModalListNotes}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </Container>
  );
}

export default ProviderSearch;
