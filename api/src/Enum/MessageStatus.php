<?php

namespace App\Enum;

enum MessageStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Read = 'read';
    case Rejected = 'rejected';
}