using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Bytewave.Domain.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
        public string Street { get; set; }

        [JsonIgnore]
        public ICollection<Order> Orders { get; set; }
    }
}
