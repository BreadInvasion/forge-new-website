import random
import json
from faker import Faker

data = {
    "RCSid": "rcsid",
    "RIN": "661234567",
    "firstName": "John",
    "lastName": "Doe",
    "email": "doej1@rpi.edu",
    "password": "password",
    "active": True,
    "groups": ["admin", "user"],
    "dateCreated": "2015-09-01T12:00:00Z",
    "lastLogin": "2015-09-02T12:00:00Z",
    "usages": [],
    "hours": ["M09:00-M12:00", "T12:00-T14:00"],
}

num_instances = 20  # Number of randomized instances to generate
random_instances = []

faker = Faker()

hourTimes = [
    "MON09:00-MON10:30",
    "MON10:30-MON13:30",
    "MON11:30-MON13:30",
    "MON09:30-MON12:30",
    "MON10:00-MON11:30",
    "MON12:00-MON14:30",
    "MON10:00-MON12:30",
    "MON11:00-MON13:30",
    "MON09:30-MON11:30",
    "MON09:00-MON11:00",
    "MON10:30-MON13:00",
    "MON10:30-MON13:30",
    "MON10:00-MON12:30",
    "MON09:30-MON12:00",
    "MON10:30-MON12:30",
    "MON11:30-MON14:00",
    "MON11:00-MON12:30",
    "MON09:30-MON11:30",
    "MON10:00-MON12:00",
    "MON09:00-MON11:30",
    "TUE09:00-TUE10:30",
    "TUE10:30-TUE13:30",
    "TUE11:30-TUE13:30",
    "TUE09:30-TUE12:30",
    "TUE10:00-TUE11:30",
    "TUE12:00-TUE14:30",
    "TUE10:00-TUE12:30",
    "TUE11:00-TUE13:30",
    "TUE09:30-TUE11:30",
    "TUE09:00-TUE11:00",
    "TUE10:30-TUE13:00",
    "TUE10:30-TUE13:30",
    "TUE10:00-TUE12:30",
    "TUE09:30-TUE12:00",
    "TUE10:30-TUE12:30",
    "TUE11:30-TUE14:00",
    "TUE11:00-TUE12:30",
    "TUE09:30-TUE11:30",
    "TUE10:00-TUE12:00",
    "TUE09:00-TUE11:30",
    "WED09:00-WED10:30",
    "WED10:30-WED13:30",
    "WED11:30-WED13:30",
    "WED09:30-WED12:30",
    "WED10:00-WED11:30",
    "WED12:00-WED14:30",
    "WED10:00-WED12:30",
    "WED11:00-WED13:30",
    "WED09:30-WED11:30",
    "WED09:00-WED11:00",
    "WED10:30-WED13:00",
    "WED10:30-WED13:30",
    "WED10:00-WED12:30",
    "WED09:30-WED12:00",
    "WED10:30-WED12:30",
    "WED11:30-WED14:00",
    "WED11:00-WED12:30",
    "WED09:30-WED11:30",
    "WED10:00-WED12:00",
    "WED09:00-WED11:30",
    "THU09:00-THU10:30",
    "THU10:30-THU13:30",
    "THU11:30-THU13:30",
    "THU09:30-THU12:30",
    "THU10:00-THU11:30",
    "THU12:00-THU14:30",
    "THU10:00-THU12:30",
    "THU11:00-THU13:30",
    "THU09:30-THU11:30",
    "THU09:00-THU11:00",
    "THU10:30-THU13:00",
    "THU10:30-THU13:30",
    "THU10:00-THU12:30",
    "THU09:30-THU12:00",
    "THU10:30-THU12:30",
    "THU11:30-THU14:00",
    "THU11:00-THU12:30",
    "THU09:30-THU11:30",
    "THU10:00-THU12:00",
    "THU09:00-THU11:30",
    "FRI09:00-FRI10:30",
    "FRI10:30-FRI13:30",
    "FRI11:30-FRI13:30",
    "FRI09:30-FRI12:30",
    "FRI10:00-FRI11:30",
    "FRI12:00-FRI14:30",
    "FRI10:00-FRI12:30",
    "FRI11:00-FRI13:30",
    "FRI09:30-FRI11:30",
    "FRI09:00-FRI11:00",
    "FRI10:30-FRI13:00",
    "FRI10:30-FRI13:30",
    "FRI10:00-FRI12:30",
    "FRI09:30-FRI12:00",
    "FRI10:30-FRI12:30",
    "FRI11:30-FRI14:00",
    "FRI11:00-FRI12:30",
    "FRI09:30-FRI11:30",
    "FRI10:00-FRI12:00",
    "FRI09:00-FRI11:30",
]


for _ in range(num_instances):
    instance = data.copy()

    instance["RIN"] = "66" + "".join(random.choices("0123456789", k=7))
    instance["firstName"] = faker.first_name()
    instance["lastName"] = faker.last_name()
    instance["RCSid"] = (
        f"{instance['lastName'].lower()[0:5]}{instance['firstName'][0].lower()}".replace(
            " ", ""
        )
    )
    instance["email"] = f"{instance['RCSid']}@rpi.edu"
    instance["password"] = "password"
    instance["active"] = random.choice([True, False])
    instance["groups"] = random.choices(
        ["admin", "user", "volunteer", "manager", "staff", "organization"],
        k=random.randint(1, 2),
    )
    instance["dateCreated"] = f"2022-01-{random.randint(1, 31):02d}T12:00:00Z"
    instance["lastLogin"] = f"2022-01-{random.randint(1, 31):02d}T12:00:00Z"
    instance["usages"] = []
    if (
        instance["groups"].count("volunteer") > 0
        or instance["groups"].count("manager") > 0
        or instance["groups"].count("staff") > 0
        or instance["groups"].count("organization") > 0
    ):
        instance["hours"] = random.choices(hourTimes, k=random.randint(1, 1))
    else:
        instance["hours"] = []
    random_instances.append(instance)

json_data = json.dumps(random_instances, indent=4)
with open("MockUserData.json", "w") as file:
    file.write(json_data)
