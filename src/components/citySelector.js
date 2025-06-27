import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Badge, Button } from 'react-bootstrap';

const CitySelector = ({ selectedCities, setSelectedCities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Hardcoded list of major African cities
  const africanCities = [
    // North Africa
    "Cairo", "Alexandria", "Giza", "Casablanca", "Rabat", 
    "Tunis", "Algiers", "Tripoli", "Khartoum", "Nouakchott",
    
    // West Africa
    "Lagos", "Abidjan", "Accra", "Kano", "Ibadan", 
    "Dakar", "Bamako", "Ouagadougou", "Niamey", "Lomé",
    "Porto-Novo", "Freetown", "Monrovia", "Banjul", "Conakry",
    
    // East Africa
    "Nairobi", "Addis Ababa", "Dar es Salaam", "Mogadishu", 
    "Kampala", "Kigali", "Bujumbura", "Djibouti", "Asmara",
    
    // Central Africa
    "Kinshasa", "Lubumbashi", "Brazzaville", "Yaoundé", 
    "Douala", "Bangui", "N'Djamena", "Malabo", "Libreville",
    
    // Southern Africa
    "Johannesburg", "Cape Town", "Durban", "Pretoria", 
    "Luanda", "Maputo", "Harare", "Lusaka", "Windhoek",
    "Gaborone", "Maseru", "Manzini", "Lilongwe"
  ];

  // Search cities when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = africanCities
      .filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 10); // Limit to 10 results
    setSearchResults(results);
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeCity = (cityToRemove) => {
    setSelectedCities(selectedCities.filter(city => city !== cityToRemove));
  };

  return (
    <div className="mb-4">
      <Form.Group>
        <Form.Label>Search for African Cities You Deliver To</Form.Label>
        <Form.Control
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start typing a city name..."
        />
      </Form.Group>

      {searchResults.length > 0 && (
        <ListGroup className="mt-2">
          {searchResults.map(city => (
            <ListGroup.Item 
              key={city} 
              action 
              onClick={() => handleCitySelect(city)}
              className="d-flex justify-content-between align-items-center"
            >
              {city}
              <Badge bg="primary">Add</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {selectedCities.length > 0 && (
        <div className="mt-3">
          <h6>Selected Delivery Cities:</h6>
          <div className="d-flex flex-wrap gap-2">
            {selectedCities.map(city => (
              <Badge key={city} bg="secondary" className="p-2 d-flex align-items-center">
                {city}
                <Button 
                  variant="link" 
                  className="text-white p-0 ms-2" 
                  onClick={() => removeCity(city)}
                  style={{ lineHeight: 1 }}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;