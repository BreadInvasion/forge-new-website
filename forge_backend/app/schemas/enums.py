from enum import Enum, StrEnum


class GenderType(Enum):
    OTHER = 0
    MALE = 1
    FEMALE = 2
    NOTDISCLOSED = 3


class PronounType(StrEnum):
    NOT_SHOWN = "not_shown"
    THEY_THEM = "they_them"
    HE_HIM = "he_him"
    SHE_HER = "she_her"
    HE_THEY = "he_they"
    SHE_THEY = "she_they"
    ALL_ANY = "all_any"
    JUST_USE_MY_NAME = "use_name"


class MachineUsageStatus(Enum):
    ACTIVE = 0
    CLEARED = 1
    FAILED = 2
